import React from 'react';

export function Header() {
    return (
        <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 shadow-lg">
            <div className="container mx-auto flex items-center justify-between">
                <h1 className="text-3xl font-extrabold tracking-tight">
                    Job Application Tracker
                </h1>
                <nav>
                    {/* You can add navigation links here if your app grows */}
                    {/* <ul className="flex space-x-4">
            <li><a href="#" className="hover:text-blue-200 transition duration-300">Home</a></li>
            <li><a href="#" className="hover:text-blue-200 transition duration-300">About</a></li>
          </ul> */}
                </nav>
            </div>
        </header>
    );
}