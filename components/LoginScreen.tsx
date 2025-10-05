

import React, { useState } from 'react';
import { LogoIcon } from './icons';
import { User, UserRole } from '../types';

interface LoginScreenProps {
  onLogin: (email: string, password?: string) => boolean;
  onSignup: (userData: Omit<User, 'id' | 'properties' | 'points' | 'unlockedBadges'>) => User;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onSignup }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<UserRole>(UserRole.PropertyManager);
    const [error, setError] = useState('');
    
    const handleDemoLogin = () => {
        setError('');
        const success = onLogin('alex.doe@example.com', 'password123');
        if (!success) {
            setError('Demo user login failed. There might be an issue with the user data.');
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (isLogin) {
            const success = onLogin(email, password);
            if (!success) {
                setError('Invalid email or password.');
            }
        } else {
            if (!email.includes('@')) {
                setError('Please enter a valid email.');
                return;
            }
            if (password.length < 6) {
                setError('Password must be at least 6 characters long.');
                return;
            }
            // In a real app, you would check if the email is already taken.
            onSignup({ name, email, password, role });
        }
    };

    const toggleForm = () => {
        setIsLogin(!isLogin);
        setError('');
        setName('');
        setEmail('');
        setPassword('');
        setRole(UserRole.PropertyManager);
    };

    return (
        <div className="min-h-screen bg-light-bg dark:bg-dark-bg flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center space-x-2">
                        <LogoIcon className="w-12 h-12" />
                        <span className="text-4xl font-bold">
                           <span className="text-primary">Home</span><span className="text-secondary">gevity</span>
                        </span>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Longevity for your home.</p>
                </div>

                <div className="bg-white dark:bg-dark-card shadow-lg rounded-xl p-8">
                    <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
                        {isLogin ? 'Welcome Back!' : 'Create an Account'}
                    </h2>

                    {error && (
                        <div className="bg-red-100 dark:bg-red-900/50 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded-md relative mb-4" role="alert">
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                           {!isLogin && (
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                                    <input type="text" id="name" required className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-slate-800 dark:text-white" value={name} onChange={e => setName(e.target.value)} />
                                </div>
                            )}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                                <input type="email" id="email" required className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-slate-800 dark:text-white" value={email} onChange={e => setEmail(e.target.value)} />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                                <input type="password" id="password" required className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-slate-800 dark:text-white" value={password} onChange={e => setPassword(e.target.value)} />
                            </div>
                            {!isLogin && (
                                <div>
                                    <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">I am a...</label>
                                    <select id="role" value={role} onChange={e => setRole(e.target.value as UserRole)} className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-slate-800 dark:text-white">
                                        {Object.values(UserRole).map(roleValue => <option key={roleValue} value={roleValue}>{roleValue}</option>)}
                                    </select>
                                </div>
                            )}
                        </div>
                        <div className="mt-6">
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                            >
                                {isLogin ? 'Log In' : 'Sign Up'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <button onClick={toggleForm} className="text-sm font-medium text-primary hover:text-green-500">
                           {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
                        </button>
                    </div>

                </div>
                 <div className="text-center mt-4">
                    <button onClick={handleDemoLogin} className="text-xs text-gray-500 hover:underline">
                        Or continue as a demo user
                    </button>
                </div>
            </div>
        </div>
    );
};