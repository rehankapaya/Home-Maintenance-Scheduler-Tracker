
import React, { useState } from 'react';
import { HomeIcon } from './icons';
import { UserRole } from '../types';

interface LoginScreenProps {
  onLogin: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className="min-h-screen bg-light-bg dark:bg-dark-bg flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center space-x-2">
                        <HomeIcon className="w-10 h-10 text-primary" />
                        <span className="text-4xl font-bold text-gray-800 dark:text-white">
                            Homely
                        </span>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Your home maintenance, simplified.</p>
                </div>

                <div className="bg-white dark:bg-dark-card shadow-lg rounded-xl p-8">
                    <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
                        {isLogin ? 'Welcome Back!' : 'Create an Account'}
                    </h2>

                    <form onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
                        <div className="space-y-4">
                           {!isLogin && (
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                                    <input type="text" id="name" required className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-slate-800 dark:text-white" defaultValue="Alex Doe" />
                                </div>
                            )}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                                <input type="email" id="email" required className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-slate-800 dark:text-white" defaultValue="alex.doe@example.com" />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                                <input type="password" id="password" required className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-slate-800 dark:text-white" defaultValue="password" />
                            </div>
                            {!isLogin && (
                                <div>
                                    <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">I am a...</label>
                                    <select id="role" className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-slate-800 dark:text-white">
                                        {Object.values(UserRole).map(role => <option key={role} value={role}>{role}</option>)}
                                    </select>
                                </div>
                            )}
                        </div>
                        <div className="mt-6">
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                            >
                                {isLogin ? 'Log In' : 'Sign Up'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <button onClick={() => setIsLogin(!isLogin)} className="text-sm font-medium text-primary hover:text-indigo-500">
                           {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
                        </button>
                    </div>

                </div>
                 <div className="text-center mt-4">
                    <button onClick={onLogin} className="text-xs text-gray-500 hover:underline">
                        Or continue as a demo user
                    </button>
                </div>
            </div>
        </div>
    );
};
