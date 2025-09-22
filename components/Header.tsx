
import React, { useState, useRef, useEffect } from 'react';
import { PlusIcon, WandIcon, MenuIcon, HomeIcon, SunIcon, MoonIcon, UserCircleIcon, ChevronDownIcon, LogoutIcon } from './icons';
import { User, Property } from '../types';

interface HeaderProps {
  user: User;
  properties: Property[];
  selectedPropertyId: string | null;
  onSelectProperty: (propertyId: string) => void;
  onLogout: () => void;
  onAddTaskClick: () => void;
  onAISuggestionsClick: () => void;
  onMenuClick: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, properties, selectedPropertyId, onSelectProperty, onLogout, onAddTaskClick, onAISuggestionsClick, onMenuClick, isDarkMode, onToggleTheme }) => {
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const selectedProperty = properties.find(p => p.id === selectedPropertyId);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  return (
    <header className="flex-shrink-0 bg-white dark:bg-dark-card shadow-sm z-20">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-4">
          <button onClick={onMenuClick} className="lg:hidden text-gray-500 dark:text-gray-400">
            <MenuIcon />
          </button>
          <div className="flex items-center space-x-2">
            <HomeIcon className="w-7 h-7 text-primary" />
            <h1 className="text-xl font-bold text-gray-800 dark:text-white hidden sm:block">
              {selectedProperty ? selectedProperty.name : 'Home Maintenance'}
            </h1>
          </div>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button onClick={onToggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
            {isDarkMode ? <SunIcon className="w-5 h-5 text-yellow-400" /> : <MoonIcon className="w-5 h-5 text-slate-600" />}
          </button>
          <button
            onClick={onAISuggestionsClick}
            className="hidden sm:flex items-center space-x-2 px-3 py-2 text-sm font-medium text-primary bg-indigo-100 dark:bg-indigo-900/50 dark:text-indigo-300 rounded-md hover:bg-indigo-200 dark:hover:bg-indigo-900/80 transition-colors"
          >
            <WandIcon className="w-4 h-4" />
            <span>AI Suggestions</span>
          </button>
          <button
            onClick={onAddTaskClick}
            className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <PlusIcon className="w-4 h-4" />
            <span className="hidden sm:inline">New Task</span>
          </button>

           {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <button onClick={() => setUserMenuOpen(!isUserMenuOpen)} className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                <UserCircleIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                <span className="hidden md:inline text-sm font-medium text-gray-700 dark:text-gray-200">{user.name}</span>
                <ChevronDownIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>
            {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-dark-card rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                    <div className="px-4 py-3 border-b dark:border-slate-600">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                    </div>
                    <div className="py-1">
                        <p className="px-4 pt-2 pb-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Properties</p>
                        {properties.map(prop => (
                            <a
                                key={prop.id}
                                href="#"
                                onClick={(e) => { e.preventDefault(); onSelectProperty(prop.id); setUserMenuOpen(false); }}
                                className={`block px-4 py-2 text-sm ${selectedPropertyId === prop.id ? 'font-bold text-primary dark:text-indigo-400' : 'text-gray-700 dark:text-gray-300'} hover:bg-gray-100 dark:hover:bg-slate-700`}
                            >
                                {prop.name}
                            </a>
                        ))}
                         <a href="#" className="block px-4 py-2 text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700">+ Add Property</a>
                    </div>
                    <div className="border-t dark:border-slate-600 py-1">
                        <button onClick={onLogout} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700">
                           <LogoutIcon className="w-5 h-5 mr-2" /> Logout
                        </button>
                    </div>
                </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
