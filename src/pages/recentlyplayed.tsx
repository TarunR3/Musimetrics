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

interface Recent {
    track: Track
    played_at: string;
}

export default function Recent() {
    const [userTopTracks, setUserTopTracks] = useState<Recent[]>([])
    const [timeframe, setTimeframe] = useState<"medium_term" | "long_term" | "short_term">("medium_term");

    const { data: session, status } = useSession();
    const spotifyApi = useSpotify()

    useEffect(() => {
        if (spotifyApi.getAccessToken()) {
            spotifyApi.getMyRecentlyPlayedTracks({ limit: 50 }).then((response) => {
                const data = response.body;
                setUserTopTracks(data.items);
            });
        }
    }, [session, spotifyApi, timeframe]);

    return (
        <div className="min-h-screen bg-neutral-950">
            <h1 className="text-center font-bold text-4xl py-4 dark:text-white">Recently Played Tracks</h1>
            <div className="container mx-auto py-4">
                {userTopTracks && userTopTracks.map((trackResult: Recent, index: number) => {
                    const playedAt = new Date(trackResult.played_at).toLocaleString();
                    return (
                        <div
                            key={trackResult.track.id}
                            className="bg-gray-100 dark:bg-neutral-900 mx-2 p-4 flex items-center justify-between rounded-lg">
                            <div className="flex items-center">
                                <h1 className="text-lg font-bold ml-4 mr-4 dark:text-white">{index + 1}.</h1>
                                <img
                                    className="mr-4"
                                    src={trackResult.track.album.images[0].url}
                                    alt={trackResult.track.name}
                                    width="64"
                                    height="64"
                                />
                                <div>
                                    <h1 className="text-lg font-bold dark:text-white">
                                        {`${trackResult.track.name}`} <span className="text-gray-600 dark:text-gray-300 font-normal">- {playedAt}</span>
                                    </h1>
                                    <p className="text-gray-600 dark:text-gray-300">{trackResult.track.artists[0].name}</p>
                                </div>
                            </div>
                            <a
                                href={trackResult.track.uri}
                                target="_blank"
                                rel="noreferrer"
                                className="text-sm text-white hover:underline text-center mr-1"
                            >
                                <img src="https://www.logo.wine/a/logo/Spotify/Spotify-Icon-Black-Logo.wine.svg" alt="Spotify Logo" width="40" height="40" className="dark:hidden" />
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/2048px-Spotify_logo_without_text.svg.png"
                                    alt="Spotify Logo"
                                    width="25"
                                    height="25"
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