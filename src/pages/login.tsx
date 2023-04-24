//@ts-nocheck
import { getProviders, signIn } from "next-auth/react";

export default function Login({ providers }) {
    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-r from-green-900 to-blue-950">
            <h1 className="text-white font-bold text-6xl">Spotimetrics</h1>
            <h1 className="text-white font-bold text-1xl mt-2 mb-8">Get Your Spotify Stats Here</h1>
            {providers &&
                Object.values(providers).map((provider) => (
                    <div key={provider.name}>
                        <button
                            className="text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-10 py-6 text-center mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                            onClick={() => signIn(provider.id, { callbackUrl: "/" })}
                        >
                            Log in with {provider.name}
                        </button>
                    </div>
                ))}
        </div>
    );
}

export async function getServerSideProps() {
    const providers = await getProviders();

    return {
        props: {
            providers,
        },
    };
}