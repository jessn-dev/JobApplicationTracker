import React from 'react';
import { GradientBackground } from './GradientBackground';

export function HomePage({ onNavigate }) {
    return (
        <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-120px)] overflow-hidden rounded-lg shadow-xl p-8 text-center">
            {/* Three.js animated gradient background */}
            <GradientBackground />

            <h2 className="relative z-10 text-4xl font-extrabold text-gray-900 mb-6">
                Welcome to Your Job Application Tracker!
            </h2>
            <p className="relative z-10 text-lg text-gray-700 mb-8 max-w-2xl">
                Effortlessly manage and monitor your job applications. Keep track of companies, positions, statuses, and important dates all in one place. Get insights into your application progress with our interactive dashboard.
            </p>
            <button
                onClick={() => onNavigate('tracker')}
                className="relative z-10 inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out transform hover:scale-105"
            >
                Go to Tracker
            </button>
        </div>
    );
}