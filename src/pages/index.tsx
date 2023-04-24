import DecadeDonut from "./PieChart";
import LengthBar from "./BarChart";
import ListeningClock from "./PolarChart";
import PopularityBubble from "./BubbleChart";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react"
import useSpotify from "../../hooks/useSpotify"

interface Album {
  id: string
  name: string;
  images: { url: string }[];
  uri: string
  release_date: string
}

interface Artist {
  name: string;
  id: string;
  images: { url: string }[];
  uri: string;
}

interface RecentArtist {
  name: string;
  id: string;
  uri: string;
}

interface Track {
  id: string,
  name: string;
  album: Album
  artists: RecentArtist[];
  uri: string;
}

interface Recent{
  track: Track
}

type DecadeCount = { [decade: string]: number };

type MinuteCount = { [length: number]: number };

type HourCount = { [time: number]: number };

type UniqueCount = { [unique: number]: number };

type RecentCount = { [recentId: string]: { recent: Track, count: number } };

export default function Home() {
  const [userTopDecades, setUserTopDecades] = useState<DecadeCount>({});
  const [userTopMinutes, setUserTopMinutes] = useState<MinuteCount>({});
  const [userTopHours, setuserTopHours] = useState<HourCount>({});
  const [userTopArtist, setuserTopArtist] = useState<Artist>();
  const [userTopRecent, setuserTopRecent] = useState<RecentCount>({});
  const [userUniqueness, setUserUniqueness] = useState<UniqueCount>({});

  const spotifyApi = useSpotify();
  const { data: session } = useSession();

  useEffect(() => {
    async function fetchTopGenres() {
      try {
        const response = await spotifyApi.getMyTopTracks({ time_range: "long_term", limit: 50 });
        const recent = await spotifyApi.getMyRecentlyPlayedTracks({ limit: 50 });
        const artist = await spotifyApi.getMyTopArtists({time_range: "short_term", limit: 1 });
        setuserTopArtist(artist.body.items[0])
        const topTracks = response.body.items;
        const recentTracks = recent.body.items;
        const decadeCount: DecadeCount = {};
        const minuteCount: MinuteCount = {};
        const hourCount: HourCount = {};
        const recentCount: RecentCount = {};
        const uniqueCount: UniqueCount = {};
        var mult = 4;
        for(const track of topTracks){
          const uq = 100 - track.popularity
          if(uq in uniqueCount){
            uniqueCount[uq] += 1 * mult;
            mult -= .04;
          }
          else{
            uniqueCount[uq] = 1 * mult;
            mult -= .04
          }
        }
        const sortedUniqueness = Object.fromEntries(
          Object.entries(uniqueCount)
            .sort((a, b) => b[1] - a[1])
        );
        setUserUniqueness(sortedUniqueness);
        for(const track of recentTracks){
          const uid = track.track.id
          if (uid in recentCount) {
            recentCount[uid].count += 1;
          } else {
            recentCount[uid] = { recent: track.track, count: 1 };
          }
        }
        const sortedRecentCount = Object.fromEntries(
          Object.entries(recentCount).sort((a, b) => b[1].count - a[1].count)
        );
        setuserTopRecent(sortedRecentCount);
        for (const track of recentTracks) {
          const playedAt = track.played_at
          const date = new Date(playedAt)
          const hour = date.getHours()
          if (hour in hourCount) {
            hourCount[hour] += 1;
          } else {
            hourCount[hour] = 1;
          }
        }
        setuserTopHours(hourCount)
        for (const track of topTracks) {
          const minute = Math.round(track.duration_ms / 60000)
          if (minute in minuteCount) {
            minuteCount[minute] += 1;
          } else {
            minuteCount[minute] = 1;
          }
        }
        for (const track of topTracks) {
          const year = Number(track.album.release_date.substring(0, 4));
          const decade = Math.floor(year / 10) * 10;
          if (decade in decadeCount) {
            decadeCount[decade] += 1;
          } else {
            decadeCount[decade] = 1;
          }
        }
        const sortedTrackTime = Object.fromEntries(
          Object.entries(minuteCount).sort((a, b) => b[1] - a[1])
        );
        setUserTopMinutes(sortedTrackTime);
        const sortedAlbumDecade = Object.fromEntries(
          Object.entries(decadeCount).sort((a, b) => b[1] - a[1])
        );
        setUserTopDecades(sortedAlbumDecade);
      } catch (error) {
        console.log("Error fetching top genres:", error);
      }
    }
    if (spotifyApi.getAccessToken()) {
      fetchTopGenres();
    }
  }, [session, spotifyApi]);

  let largestValue;
  if (Object.keys(userTopDecades).length !== 0) {
    largestValue = Object.entries(userTopDecades).reduce((prev, curr) => {
      return prev[1] > curr[1] ? prev : curr;
    });
  }

  let largestTrack;
  if (Object.keys(userTopMinutes).length !== 0) {
    largestTrack = Object.entries(userTopMinutes).reduce((prev, curr) => {
      return prev[1] > curr[1] ? prev : curr;
    });
  }

  let largestHour;
  if (Object.keys(userTopHours).length !== 0) {
    largestHour = Object.entries(userTopHours).reduce((prev, curr) => {
      return prev[1] > curr[1] ? prev : curr;
    });
  }

  let avUq;
  const keys = Object.keys(userUniqueness);
  if (keys.length !== 0) {
    const sum = keys.reduce((acc, key) => acc + parseInt(key), 0);
    avUq = sum / keys.length;
  }

  return (
    <div className="min-h-screen bg-neutral-950">
      <h1 className="text-center font-bold text-4xl py-4 text-white">Your Stats</h1>
      <div className="container mx-auto py-4 bg-neutral-800 rounded-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-4">
          <div className="bg-neutral-900 rounded-lg p-4">
            <h2 className="text-white border-b-2 pb-1 mb-4 font-bold text-lg">The Songs You're Into Now</h2>
            {Object.entries(userTopRecent)
              .slice(0, 5)
              .map(([albumId, { recent, count }], index) => {
            return (
              <div
                key={albumId}
                className="bg-gray-100 dark:bg-neutral-900 py-4 flex flex-row items-center justify-start rounded-lg"
              >
                <h1 className = 'text-lg dark:text-white font-bold pr-2'>{index + 1}.</h1>
                <img
                  className = "mr-4"
                  src={recent.album.images[0].url}
                  alt={recent.name}
                  width="64"
                  height="64"
                  />
                <div>
                <h1 className="text-base dark:text-white font-bold">{`${recent.name
                  }`}</h1>
                <p className="text-gray-600 dark:text-neutral-400">{recent.artists[0].name}</p>
                </div>
              </div>
            );
          })}
            </div>
            <div className="bg-neutral-900 rounded-lg p-4 justify">
              <h2 className="text-white border-b-2 pb-1 mb-3 font-bold text-lg">Your Top Artist</h2>
          {userTopArtist && (
            <>
              <img src={userTopArtist.images[0].url} alt={userTopArtist.name} className="w-auto h-auto mb-4" />
              <h1 className="text-lg dark:text-white font-bold mb-4 text-center">{userTopArtist.name}</h1>
              </>
          )}
          </div>
          <div className="bg-neutral-900 rounded-lg p-4">
            <h2 className="text-white border-b-2 pb-1 font-bold text-lg">How Unique is Your Taste</h2>
            <p className="text-white mb-8">You're Uniquness Score is <span className="font-bold">{avUq && avUq.toFixed()}</span></p>
            {userTopDecades && <PopularityBubble data={userUniqueness} />}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="bg-neutral-900 rounded-lg p-4">
            <h2 className="text-white border-b-2 pb-1 font-bold text-lg">By The Decades</h2>
            <p className="text-white mb-8">Your favorite decade of music is the <span className="font-bold">{largestValue && largestValue[0]}s</span></p>
            {userTopDecades && <DecadeDonut data={userTopDecades} />}
          </div>
            <div className="bg-neutral-900 rounded-lg p-4">
            <h2 className="text-white border-b-2 pb-1 font-bold text-lg">Your Ideal Song Length</h2>
            <p className="text-white mb-8">Your favorite songs are <span className="font-bold">{largestTrack && largestTrack[0]}</span> minutes long</p>
            {userTopMinutes && <LengthBar data={userTopMinutes} />}
          </div>
          <div className="bg-neutral-900 rounded-lg p-4">
            <h2 className="text-white border-b-2 pb-1 font-bold text-lg">Your Listening Clock</h2>
            <p className="text-white mb-8">You love listening to music at <span className="font-bold">{largestHour && largestHour[0]}:00</span></p>
            {userTopHours && <ListeningClock data={userTopHours} />}
          </div>
        </div>
      </div>
      </div>
      <div className = "text-neutral-950">
        a
      </div>
    </div>
  );
}
/*
<div className="grid grid-cols-1 gap-6 md:grid-cols-3 justify-start">
<div className="bg-neutral-900 rounded-lg p-4">
  <h2 className="text-white border-b-2 pb-1 font-bold text-lg">By The Decades</h2>
  <h3 className="text-white">
    Your favorite decade of music is the <span className="font-bold">{largestValue && largestValue[0]}s</span>
  </h3>
  {userTopDecades && <DecadeDonut data={userTopDecades} />}
</div>
<div className="bg-neutral-900 rounded-lg p-4">
  <h2 className="text-white border-b-2 pb-1 font-bold text-lg">Your Ideal Song Length</h2>
  <h3 className="text-white pb-4">
    Your favorite songs are <span className="font-bold">{largestTrack && largestTrack[0]}</span> minutes long
  </h3>
  <LengthBar data={userTopMinutes} />
</div>
<div className="bg-neutral-900 rounded-lg p-4">
  <h2 className="text-white border-b-2 pb-1 font-bold text-lg">Your Favorite Time to Hear Music</h2>
  <h3 className="text-white pb-2">
    You love listening to music at <span className="font-bold">{largestHour && largestHour[0]}:00</span>
  </h3>
  <ListeningClock data={userTopHours} />
</div>
*/