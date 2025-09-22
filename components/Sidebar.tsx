
import React from 'react';
import { HomeIcon, CalendarIcon, CheckCircleIcon } from './icons';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const NavLink: React.FC<{ icon: React.ReactNode; label: string; active?: boolean }> = ({ icon, label, active }) => (
    <a
      href="#"
      className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
        active
          ? 'bg-primary text-white'
          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700'
      }`}
    >
      {icon}
      <span className="ml-3">{label}</span>
    </a>
  );
  

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  return (
    <>
      {/* Overlay for mobile */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-30 z-30 lg:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      ></div>
      
      <aside
        className={`fixed lg:relative z-40 lg:z-auto w-64 h-full bg-white dark:bg-dark-card flex-col flex-shrink-0 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex items-center justify-center h-16 border-b dark:border-slate-700">
           <div className="flex items-center space-x-2">
            <HomeIcon className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold text-gray-800 dark:text-white">
              Homely
            </span>
          </div>
        </div>
        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-2">
            <li>
              <NavLink icon={<HomeIcon className="w-5 h-5" />} label="Dashboard" active />
            </li>
            <li>
              <NavLink icon={<CalendarIcon className="w-5 h-5" />} label="Upcoming Tasks" />
            </li>
            <li>
              <NavLink icon={<CheckCircleIcon className="w-5 h-5" />} label="Completed Tasks" />
            </li>
          </ul>
        </nav>
        <div className="p-4 border-t dark:border-slate-700">
            <div className="text-xs text-center text-gray-500 dark:text-gray-400">
                &copy; 2024 Homely Inc.
            </div>
        </div>
      </aside>
    </>
  );
};
