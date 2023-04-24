import React from "react";
import { signOut } from "next-auth/react";

const Footer = () => {
    return (
        <footer className="bg-black py-4 border-t border-gray-400">
            <div className="container mx-auto flex flex-col">
                <a href="about" className="text-gray-300 mb-2 text-left w-max">About</a>
                <button className="text-gray-300 mb-2 text-left w-max" onClick={() => { signOut() }}>Log Out</button>
            </div>
        </footer>
    );
};

export default Footer;