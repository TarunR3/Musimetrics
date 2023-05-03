import { useState, useEffect } from "react";
import { useSession } from "next-auth/react"
import useSpotify from "../../hooks/useSpotify"

type GenreCount = { [genre: string]: number };
type GenrePercentage = { [genre: string]: number };

function Bar({ value }: GenrePercentage) {
    return (
        <div className="flex flex-col-reverse justify-start h-8 w-full">
            <div
                className="bg-green-700 h-full rounded-r-lg"
                style={{ width: `${value * 100}%`, height: "100%" }}
            />
        </div>
    );
}

export default function TopGenres() {
    const [userTopGenres, setUserTopGenres] = useState<GenrePercentage>({});
    const [timeframe, setTimeframe] = useState<"medium_term" | "long_term" | "short_term">("medium_term");

    const dictTimeframes: { [key: string]: string } = {
        "short_term": "Past 4 Weeks",
        "medium_term": "Past 6 Months",
        "long_term": "All Time"
    };

    const handleTimeframeChange = (newTimeframe: "medium_term" | "long_term" | "short_term") => {
        setTimeframe(newTimeframe);
    };

    const spotifyApi = useSpotify();
    const { data: session } = useSession();

    useEffect(() => {
        async function fetchTopGenres() {
            try {
                const response = await spotifyApi.getMyTopArtists({ time_range: timeframe, limit: 50 });
                const topArtists = response.body.items;
                const genreCount: GenreCount = {};
                const l = topArtists.length;
                for (const artist of topArtists) {
                    for (const genre of artist.genres) {
                        if (genre in genreCount) {
                            genreCount[genre] += 1;
                        } else {
                            genreCount[genre] = 1;
                        }
                    }
                }
                const genrePercentage: GenrePercentage = {};
                for (const [genre, count] of Object.entries(genreCount)) {
                    genrePercentage[genre] = (count / topArtists.length);
                }
                const sortedGenrePercentage = Object.fromEntries(
                    Object.entries(genrePercentage).sort((a, b) => b[1] - a[1])
                );
                setUserTopGenres(sortedGenrePercentage);
            } catch (error) {
                console.log("Error fetching top genres:", error);
            }
        }
        if (spotifyApi.getAccessToken()) {
            fetchTopGenres();
        }
    }, [session, spotifyApi, timeframe]);

    return (
        <div className="min-h-screen bg-neutral-950">
            <h1 className="text-center font-bold text-4xl py-4 dark:text-white">Top Genres ({dictTimeframes[timeframe]})</h1>
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
            <div className = "mx-2">
            <div className="container mx-auto py-1 dark:bg-neutral-900 rounded-xl mt-4">
                {Object.entries(userTopGenres)
                    .slice(0, 50)
                    .map(([genre, percentage], index) => (
                        <div key={genre} className="flex flex-col items-start w-full px-4 py-2">
                            <h1 className="text-white">{index + 1}. {genre.charAt(0).toUpperCase() + genre.slice(1)}</h1>
                            <Bar value={percentage} />
                        </div>
                    ))}
            </div>
            </div>
        </div>
    );
}