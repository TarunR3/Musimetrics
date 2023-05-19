import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import useSpotify from "../../hooks/useSpotify"

interface Artist {
  name: string;
  id: string;
  images: { url: string }[];
  uri: string;
}

export default function TopArtists(): JSX.Element {
  const [userTopArtists, setUserTopArtists] = useState<Artist[]>([])
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
      spotifyApi.getMyTopArtists({ time_range: timeframe, limit: 50 }).then((response) => {
        const data = response.body;
        setUserTopArtists(data.items);
      });
    }
  }, [session, spotifyApi, timeframe]);

  return (
    <div className="min-h-screen bg-neutral-950">
      <h1 className="text-center font-bold text-4xl py-4 dark:text-white">Top Artists ({dictTimeframes[timeframe]})</h1>
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
      <div className = "py-4 mx-2">
      <div className="container mx-auto my-4 py-4 px-8 bg-neutral-800 rounded-lg">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {userTopArtists.map((artistResult: Artist, index: number) => {
            return (
              <div
                key={artistResult.id}
                className="bg-gray-100 dark:bg-neutral-900 p-4 flex flex-col items-center justify-center rounded-lg"
              >
                <img
                  src={artistResult?.images[0]?.url}
                  alt={artistResult.name}
                  className="w-full h-auto mb-4"
                />
                <h1 className="text-lg dark:text-white font-bold mb-4">{`${index + 1}. ${artistResult.name
                  }`}</h1>
                <a
                  href={artistResult.uri}
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
    </div>
    </div>
  )
}
