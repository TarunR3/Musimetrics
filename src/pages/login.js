import { getProviders, signIn } from "next-auth/react";

function Login({ providers }) {
    return (
        <div className="bg-neutral-950 flex items-center justify-center min-h-screen">
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

export default Login;

export async function getServerSideProps() {
    const providers = await getProviders();

    return {
        props: {
            providers,
        },
    };
}