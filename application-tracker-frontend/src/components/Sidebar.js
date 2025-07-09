import React from 'react';
import { LayoutDashboard, ListPlus, LogOut } from 'lucide-react'; // Import Lucide icons

export function Sidebar({ onNavigate, onShowFormAndList, onShowDashboard, currentPage, showApplicationFormAndList, onLogout }) {
    return (
        <div className="fixed top-0 left-0 h-full w-64 bg-gray-800 text-white p-6 flex flex-col shadow-lg z-20 pt-20"> {/* Added pt-20 for spacing below the fixed header */}
            <div className="text-2xl font-bold mb-8">Dashboard Nav</div>
            <nav className="flex-1">
                <ul className="space-y-4">
                    <li>
                        <button
                            onClick={onShowDashboard}
                            className={`w-full text-left px-4 py-2 rounded-md text-lg font-medium flex items-center space-x-3 transition duration-300 ease-in-out ${
                                !showApplicationFormAndList ? 'bg-blue-700' : 'hover:bg-gray-700'
                            }`}
                        >
                            <LayoutDashboard size={20} />
                            <span>Dashboard</span>
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={onShowFormAndList}
                            className={`w-full text-left px-4 py-2 rounded-md text-lg font-medium flex items-center space-x-3 transition duration-300 ease-in-out ${
                                showApplicationFormAndList ? 'bg-blue-700' : 'hover:bg-gray-700'
                            }`}
                        >
                            <ListPlus size={20} />
                            <span>Manage Applications</span>
                        </button>
                    </li>
                </ul>
            </nav>
            {/* Sign Out button at the bottom */}
            <div className="mt-auto pt-8"> {/* mt-auto pushes it to the bottom, pt-8 for spacing */}
                <button
                    onClick={onLogout}
                    className="w-full text-left px-4 py-2 rounded-md text-lg font-medium flex items-center space-x-3 bg-red-600 hover:bg-red-700 transition duration-300 ease-in-out shadow-md"
                >
                    <LogOut size={20} />
                    <span>Sign Out</span>
                </button>
            </div>
        </div>
    );
}