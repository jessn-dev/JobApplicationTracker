import React, { useState } from 'react';
import { GradientBackground } from './GradientBackground';

export function AuthPage({ mode, onAuthSuccess, onClose, onSwitchMode }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const isLoginMode = mode === 'login';
    const title = isLoginMode ? 'Login to Your Account' : 'Create Your Account';
    const submitButtonText = isLoginMode ? 'Login' : 'Sign Up';
    const switchModeText = isLoginMode ? "Don't have an account?" : "Already have an account?";
    const switchModeButtonText = isLoginMode ? 'Sign Up' : 'Login';

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isLoginMode) {
            if (email && password) {
                alert(`Logging in with Email: ${email}`);
                onAuthSuccess();
            } else {
                alert('Please enter email and password.');
            }
        } else { // Signup mode
            if (email && password && confirmPassword && password === confirmPassword) {
                alert(`Signing up with Email: ${email}`);
                onAuthSuccess();
            } else if (password !== confirmPassword) {
                alert('Passwords do not match.');
            } else {
                alert('Please fill in all fields.');
            }
        }
    };

    const handleSocialAuth = (provider) => {
        alert(`${isLoginMode ? 'Logging in' : 'Signing up'} with ${provider}... (Integration coming soon!)`);
        // Simulate success after a short delay
        setTimeout(() => {
            onAuthSuccess();
        }, 1000);
    };

    return (
        <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-120px)] overflow-hidden rounded-lg shadow-xl p-8 text-center">
            <GradientBackground /> {/* Reusing the animated gradient background */}

            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 z-20 text-xl font-bold"
                aria-label="Close"
            >
                &times;
            </button>

            <h2 className="relative z-10 text-3xl font-extrabold text-gray-900 mb-6">{title}</h2>

            <form onSubmit={handleSubmit} className="relative z-10 w-full max-w-md bg-white p-8 rounded-lg shadow-md space-y-4">
                <div>
                    <label htmlFor="email" className="sr-only">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email Address"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                <div>
                    <label htmlFor="password" className="sr-only">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                {!isLoginMode && (
                    <div>
                        <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm Password"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                )}
                <button
                    type="submit"
                    className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out"
                >
                    {submitButtonText}
                </button>
            </form>

            <div className="relative z-10 w-full max-w-md mt-6 text-gray-700">
                <div className="relative flex py-5 items-center">
                    <div className="flex-grow border-t border-gray-400"></div>
                    <span className="flex-shrink mx-4 text-gray-600">Or {isLoginMode ? 'login' : 'sign up'} with</span>
                    <div className="flex-grow border-t border-gray-400"></div>
                </div>

                <div className="flex justify-center space-x-4 mb-6">
                    <button
                        onClick={() => handleSocialAuth('Google')}
                        className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path fill="#4285F4" d="M20.64 12.2045c0-.638-.06-1.252-.164-1.845H12v3.69h4.684c-.2.986-.772 1.827-1.636 2.396v2.38h3.08c1.808-1.66 2.844-4.1 2.844-7.021z"/>
                            <path fill="#34A853" d="M12 21c3.24 0 5.933-1.08 7.916-2.916l-3.08-2.38c-.866.57-1.904.904-3.096.904-2.4 0-4.44-1.62-5.18-3.81H3.82v2.466C5.818 19.22 8.75 21 12 21z"/>
                            <path fill="#FBBC05" d="M6.82 14.1c-.1-.29-.16-.59-.16-.9s.06-.61.16-.9V9.84H3.82c-.308.613-.485 1.29-.485 2.06s.177 1.447.485 2.06L6.82 14.1z"/>
                            <path fill="#EA4335" d="M12 5.86c1.77 0 3.35.617 4.594 1.794L19.42 4.45C17.436 2.516 14.74 1 12 1 8.75 1 5.817 2.78 3.82 4.724L6.82 7.1C7.56 4.91 9.6 3.29 12 3.29z"/>
                        </svg>
                        Google
                    </button>
                    <button
                        onClick={() => handleSocialAuth('GitHub')}
                        className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path fill="currentColor" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.085 1.838 1.238 1.838 1.238 1.07 1.835 2.809 1.305 3.49.998.108-.775.418-1.305.762-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.12-.3-.53-1.52.11-3.18 0 0 1-.32 3.3-.12 1.02-.28 2.09-.42 3.16-.42.01 0 .02 0 .03 0 .01 0 .02 0 .03 0 1.07.001 2.14.14 3.16.42 2.3-1.8 3.3-.12 3.3-.12.64 1.66.23 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.62-5.47 5.92.43.37.82 1.1.82 2.22 0 1.606-.015 2.896-.015 3.286 0 .32.21.69.82.57C20.562 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12z"/>
                        </svg>
                        GitHub
                    </button>
                </div>

                <p className="text-sm">
                    {switchModeText}{' '}
                    <button
                        onClick={() => onSwitchMode(isLoginMode ? 'signup' : 'login')}
                        className="text-indigo-600 hover:text-indigo-800 font-medium transition duration-300 ease-in-out"
                    >
                        {switchModeButtonText}
                    </button>
                </p>
            </div>
        </div>
    );
}