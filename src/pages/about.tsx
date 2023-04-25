import React from "react";

export default function About() {
    return (
        <div className="min-h-screen bg-neutral-950 py-8">
            <div className="w-1/2 mx-auto">
                <p className="text-gray-200 mb-2 font-bold text-5xl border-b pb-2">About Musimetrics</p>
                <p className="text-gray-200 mb-2">Musimetrics allows you to use your Spotify data in order to see various data about your music listening stats. It uses Spotify&rsquo;s Web API to display your listening to history, top tracks, artists, genres, albums and much more.</p>
                <p className="text-gray-200 mb-2  pt-10 pb-2 font-bold text-lg border-b">Disclaimer</p>
                <p className="text-gray-200 mb-2">Please note that this website is not affiliated with or endorsed by Spotify in any way. I do not own any of the images, tracks, or other content provided by Spotify through the API, and all such content remains the property of its respective owners. The use of Spotify&rsquo;s API is solely for the purpose of providing access to Spotify content on this website. I do not claim ownership or control over any of the content provided by Spotify, and I cannot guarantee the accuracy or availability of any such content.</p>
                <p className="text-gray-200 mb-2  pt-10 pb-2 font-bold text-lg border-b">FAQ</p>
                <p className="text-gray-200 mb-2 font-bold">Is it safe</p>
                <p className="text-gray-200 mb-2 ">Musimetrics adheres to all modern standards in web security and logging in to Musimetrics is handled by Spotify so it is as secure as Spotify itself</p>
                <p className="text-gray-200 mb-2 font-bold">Do you collect my data</p>
                <p className="text-gray-200 mb-2 ">The website only has access to your spotify profile, top items, and recently played tracks. Data is only used to display these items or calculate additional metrics such as your favorite genre or decade of music.</p>
                <p className="text-gray-200 mb-2 font-bold">This feature doesn&rsquo;t work</p>
                <p className="text-gray-200 mb-2 ">If you listen in private mode or have a new account there might be limited data. If there is a major bug. Email me about it!</p>
                <p className="text-gray-200 mb-2 font-bold">How was this made</p>
                <p className="text-gray-200 mb-2 ">All the source code is open sourced on Github! The website was built using Next.js, TypeScript, and Tailwind CSS</p>
            </div>
        </div>
    );
};

