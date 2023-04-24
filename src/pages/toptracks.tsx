import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import useSpotify from "../../hooks/useSpotify"

interface Artist {
    name: string
}

interface Album {
    images: { url: string }[];
}

interface Track {
    id: string,
    name: string;
    album: Album
    artists: Artist[];
    uri: string;
}

export default function TopArtists() {
    const [userTopTracks, setUserTopTracks] = useState<Track[]>([])
    const [timeframe, setTimeframe] = useState<"medium_term" | "long_term" | "short_term">("medium_term");

    const dictTimeframes: { [key: string]: string } = {
        "short_term": "Past 4 Weeks",
        "medium_term": "Past 6 Months",
        "long_term": "All Time"
    };

    const handleTimeframeChange = (newTimeframe: "medium_term" | "long_term" | "short_term") => {
        setTimeframe(newTimeframe);
    };

    const { data: session, status } = useSession();
    const spotifyApi = useSpotify()

    useEffect(() => {
        if (spotifyApi.getAccessToken()) {
            spotifyApi.getMyTopTracks({ time_range: timeframe, limit: 50 }).then((response) => {
                const data = response.body;
                console.log(data.items);
                setUserTopTracks(data.items);
            });
        }
    }, [session, spotifyApi, timeframe]);

    return (
        <div className="min-h-screen bg-neutral-950">
            <h1 className="text-center font-bold text-4xl py-4 dark:text-white">Top Tracks ({dictTimeframes[timeframe]})</h1>
            <div className="flex justify-center">
                <button
                    className={`mx-2 py-2 px-4 rounded-lg font-semibold ${timeframe === "short_term" ? "bg-green-600 text-white" : "bg-neutral-400 text-gray-800"
                        }`}
                    onClick={() => handleTimeframeChange("short_term")}
                >
                    Last 4 Weeks
                </button>
                <button
                    className={`mx-2 py-2 px-4 rounded-lg font-semibold ${timeframe === "medium_term" ? "bg-green-600 text-white" : "bg-neutral-400 text-gray-800"
                        }`}
                    onClick={() => handleTimeframeChange("medium_term")}
                >
                    Last 6 Months
                </button>
                <button
                    className={`mx-2 py-2 px-4 rounded-lg font-semibold ${timeframe === "long_term" ? "bg-green-600 text-white" : "bg-neutral-400 text-gray-800"
                        }`}
                    onClick={() => handleTimeframeChange("long_term")}
                >
                    All Time
                </button>
            </div>
            <div className="container mx-auto py-4">
                {userTopTracks && userTopTracks.map((trackResult: Track, index: number) => {
                    return (
                        <div
                            key={trackResult.id}
                            className="bg-gray-100 dark:bg-neutral-900 p-4 flex items-center justify-between rounded-lg">
                            <div className="flex items-center">
                                <h1 className="text-lg font-bold ml-4 mr-4 dark:text-white">{index + 1}.</h1>
                                <img
                                    className="mr-4"
                                    src={trackResult.album.images[0].url}
                                    alt={trackResult.name}
                                    width="64"
                                    height="64"
                                />
                                <div>
                                    <h1 className="text-lg font-bold dark:text-white">{`${trackResult.name}`}</h1>
                                    <p className="text-gray-600 dark:text-gray-300">{trackResult.artists[0].name}</p>
                                </div>
                            </div>
                            <a
                                href={trackResult.uri}
                                target="_blank"
                                rel="noreferrer"
                                className="text-sm text-white hover:underline text-center"
                            >
                                <img src="https://www.logo.wine/a/logo/Spotify/Spotify-Icon-Black-Logo.wine.svg" alt="Spotify Logo" width="40" height="40" className="dark:hidden" />
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/2048px-Spotify_logo_without_text.svg.png"
                                    alt="Spotify Logo"
                                    width="20"
                                    height="20"
                                    className="hidden dark:block"
                                />
                            </a>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}