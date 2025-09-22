
import React from 'react';
import { PlusIcon, WandIcon, MenuIcon, HomeIcon, SunIcon, MoonIcon } from './icons';

interface HeaderProps {
  onAddTaskClick: () => void;
  onAISuggestionsClick: () => void;
  onMenuClick: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onAddTaskClick, onAISuggestionsClick, onMenuClick, isDarkMode, onToggleTheme }) => {
  return (
    <header className="flex-shrink-0 bg-white dark:bg-dark-card shadow-sm z-10">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-4">
          <button onClick={onMenuClick} className="lg:hidden text-gray-500 dark:text-gray-400">
            <MenuIcon />
          </button>
          <div className="flex items-center space-x-2">
            <HomeIcon className="w-7 h-7 text-primary" />
            <h1 className="text-xl font-bold text-gray-800 dark:text-white hidden sm:block">
              Home Maintenance
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
        </div>
      </div>
    </header>
  );
};
