import React from 'react';

export function Header({ currentPage, onNavigate, onSignInClick, onLogout, isLoggedIn, setShowAuthPage }) {
    const handleHomeClick = () => {
        onNavigate('home');
        setShowAuthPage(false);
    };

    // The Header component will now only render when not logged in or not on the tracker page.
    // Its internal logic for showing/hiding elements based on isLoggedIn/currentPage is simplified.
    return (
        <header className="fixed w-full z-30 top-0 text-white py-4 px-6 bg-transparent">
            <div className="container mx-auto flex items-center justify-between">
                <div className="flex items-center space-x-6">
                    <h1 className="text-3xl font-extrabold tracking-tight text-white">
                        Job Application Tracker
                    </h1>
                    <nav>
                        <ul className="flex space-x-4">
                            <li>
                                <button
                                    onClick={handleHomeClick}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition duration-300 ease-in-out ${
                                        currentPage === 'home' ? 'bg-blue-700' : 'hover:bg-blue-500'
                                    }`}
                                >
                                    Home
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => onNavigate('tracker')}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition duration-300 ease-in-out ${
                                        currentPage === 'tracker' ? 'bg-blue-700' : 'hover:bg-blue-500'
                                    }`}
                                >
                                    Tracker
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>

                <div className="flex items-center space-x-4">
                    {!isLoggedIn ? (
                        <button
                            onClick={onSignInClick}
                            className="px-4 py-2 border border-white rounded-md text-sm font-medium text-white hover:bg-white hover:text-blue-600 transition duration-300 ease-in-out"
                        >
                            Sign In
                        </button>
                    ) : (
                        <button
                            onClick={onLogout}
                            className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition duration-300 ease-in-out shadow-md"
                        >
                            Logout
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
}