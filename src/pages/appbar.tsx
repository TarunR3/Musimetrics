import { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react"
import useSpotify from "../../hooks/useSpotify"
import Link from 'next/link'

interface Profile {
    id: string;
    images?: { url: string }[];
}

const CACHE_KEY = "userProfile";

function AppBar() {
    const [userProfile, setUserProfile] = useState<Profile>();
    const { data: session, status } = useSession();
    const spotifyApi = useSpotify()

    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        // Check if the cached userProfile exists in sessionStorage
        const cachedUserProfile = sessionStorage.getItem(CACHE_KEY);
        if (cachedUserProfile) {
            setUserProfile(JSON.parse(cachedUserProfile));
        }

        if (userProfile) {
            return;
        }

        if (spotifyApi.getAccessToken()) {
            spotifyApi.getMe().then((response) => {
                const data = response.body;
                console.log("Hello");
                setUserProfile(data);

                // Cache the userProfile in sessionStorage
                sessionStorage.setItem(CACHE_KEY, JSON.stringify(data));
            });
        }
    }, [session, spotifyApi]);

    return (
        <header className="bg-gray-800 text-white fixed w-full z-50 top-0">
            <nav className="bg-white border-gray-200 dark:bg-black">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    <Link href = {process.env.NEXT_PUBLIC_URL || "#"} className="flex items-center">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/5c/Icon_Stats_active.svg" className="h-8 mr-3" alt="App Logo" />
                        <span className="self-center text-2xl font-semibold whitespace-nowrap text-black dark:text-white">Musimetrics</span>
                    </Link>
                    <button type="button" className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-default" aria-expanded="false" onClick={() => setMenuOpen(!menuOpen)}>
                        <span className="sr-only">Open main menu</span>
                        <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
                    </button>
                    <div className="hidden w-full md:block md:w-auto" id="navbar-default">
                        <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-black dark:border-gray-700">
                            <li>
                                <Link href="toptracks" className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-green-700 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Top Tracks</Link>
                            </li>
                            <li>
                                <Link href="topartists" className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-green-700 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Top Artists</Link>
                            </li>
                            <li>
                                <Link href="topgenres" className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-green-700 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Top Genres</Link>
                            </li>
                            <li>
                                <Link href="topalbums" className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-green-700 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Top Albums</Link>
                            </li>
                            <li>
                                <Link href="recentlyplayed" className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-green-700 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Recently Played</Link>
                            </li>
                            <div className="flex md:order-2">
                                {userProfile ? (
                                    <>
                                        <Link className="hidden-arrow flex items-center whitespace-nowrap transition duration-150 ease-in-out motion-reduce:transition-none" href="#" id="dropdownMenuButton2" role="button" data-te-dropdown-toggle-ref aria-expanded="false">
                                            <img src={userProfile.images?.[0]?.url} className="rounded-full" style={{ height: "35px", width: "35px" }} alt="" loading="lazy" />
                                        </Link>
                                    </>
                                ) : (
                                    <div style={{ height: "35px", width: "35px" }}></div>
                                )}
                            </div>
                        </ul>
                    </div>
                    <div className={`${menuOpen ? '' : 'hidden'} md:hidden items-center justify-between w-full`} id="navbar-default">
                        <ul className="flex flex-col font-medium p-4 border-gray-100 rounded-lg bg-neutral-900">
                            <li>
                                <Link href="toptracks" className="block py-2 pl-3 pr-4 text-white rounded hover:bg-gray-100 hover:text-green-700">Top Tracks</Link>
                            </li>
                            <li>
                                <Link href="topartists" className="block py-2 pl-3 pr-4 text-white rounded hover:bg-gray-100 hover:text-green-700">Top Artists</Link>
                            </li>
                            <li>
                                <Link href="topgenres" className="block py-2 pl-3 pr-4 text-white rounded hover:bg-gray-100 hover:text-green-700">Top Genres</Link>
                            </li>
                            <li>
                                <Link href="topalbums" className="block py-2 pl-3 pr-4 text-white rounded hover:bg-gray-100 hover:text-green-700">Top Albums</Link>
                            </li>
                            <li>
                                <Link href="recentlyplayed" className="block py-2 pl-3 pr-4 text-white rounded hover:bg-gray-100 hover:text-green-700">Recently Played</Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="border-t-2 border-gray-300 dark:border-gray-500 mx-auto w-5/5" style={{ borderWidth: '1px' }}></div>
            </nav>
        </header>
    )
}

export default AppBar