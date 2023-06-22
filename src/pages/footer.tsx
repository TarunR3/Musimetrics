import React from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";


function logOut(){
    sessionStorage.clear();
    signOut();
}

const Footer = () => {
    return (
        <footer className="bg-black py-4 border-t border-gray-400">
            <div className="container mx-auto flex flex-col">
                <Link href="about" className="text-gray-300 mb-2 ml-2 text-left w-max">About</Link>
                <button className="text-gray-300 mb-2 ml-2 text-left w-max" onClick={() => { logOut() }}>Log Out</button>
            </div>
        </footer>
    );
};

export default Footer;