import React, { useState, useRef, useEffect } from 'react';
import { PlusIcon, WandIcon, MenuIcon, HomeIcon, SunIcon, MoonIcon, UserCircleIcon, ChevronDownIcon, LogoutIcon, BellIcon, DeleteIcon } from './icons';
import { User, Property, AppNotification, SyncStatus } from '../types';
import { NotificationsPopover } from './NotificationsPopover';

interface HeaderProps {
  user: User;
  properties: Property[];
  selectedPropertyId: string | null;
  onSelectProperty: (propertyId: string) => void;
  onLogout: () => void;
  onAddTaskClick: () => void;
  onAISuggestionsClick: () => void;
  onAddPropertyClick: () => void;
  onDeletePropertyClick: (property: Property) => void;
  onMenuClick: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  notifications: AppNotification[];
  notificationPermission: NotificationPermission;
  onMarkAllNotificationsAsRead: () => void;
  onRequestNotificationPermission: () => void;
  syncStatus: SyncStatus;
}

const SyncIndicator: React.FC<{ status: SyncStatus }> = ({ status }) => {
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [bgColor, setBgColor] = useState('');

    useEffect(() => {
        let timer: number;
        switch (status) {
            case 'offline':
                setVisible(true);
                setMessage('You are offline. Changes are saved locally.');
                setBgColor('bg-red-500');
                break;
            case 'syncing':
                setVisible(true);
                setMessage('Reconnecting & syncing...');
                setBgColor('bg-yellow-500');
                break;
            case 'synced':
                setVisible(true);
                setMessage('Back online & synced!');
                setBgColor('bg-green-500');
                timer = window.setTimeout(() => setVisible(false), 2500);
                break;
        }
        return () => clearTimeout(timer);
    }, [status]);

    if (!visible && status !== 'offline' && status !== 'syncing') return null;

    return (
        <div className={`w-full text-center text-white text-xs font-semibold py-1 ${bgColor} transition-all duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}>
            {message}
        </div>
    );
};


export const Header: React.FC<HeaderProps> = ({ 
    user, properties, selectedPropertyId, onSelectProperty, onLogout, 
    onAddTaskClick, onAISuggestionsClick, onMenuClick, isDarkMode, onToggleTheme,
    notifications, notificationPermission, onMarkAllNotificationsAsRead, onRequestNotificationPermission,
    syncStatus, onAddPropertyClick, onDeletePropertyClick
}) => {
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  
  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const selectedProperty = properties.find(p => p.id === selectedPropertyId);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenu.ref.current && !userMenu.ref.current.contains(event.target as Node)) {
        userMenu.setOpen(false);
      }
      if (notificationsMenu.ref.current && !notificationsMenu.ref.current.contains(event.target as Node)) {
        notificationsMenu.setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const createMenuToggler = (setOpen: React.Dispatch<React.SetStateAction<boolean>>, otherMenus: {setOpen: React.Dispatch<React.SetStateAction<boolean>>}[]) => {
    return () => {
        setOpen(prev => !prev);
        otherMenus.forEach(menu => menu.setOpen(false));
    };
  };

  const userMenu = { ref: userMenuRef, setOpen: setUserMenuOpen };
  const notificationsMenu = { ref: notificationsRef, setOpen: setNotificationsOpen };

  const toggleUserMenu = createMenuToggler(userMenu.setOpen, [notificationsMenu]);
  const toggleNotifications = createMenuToggler(notificationsMenu.setOpen, [userMenu]);
  
  return (
    <header className="flex-shrink-0 bg-white dark:bg-dark-card shadow-sm z-20">
      <SyncIndicator status={syncStatus} />
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
          
          {/* Notifications Menu */}
          <div className="relative" ref={notificationsRef}>
             <button onClick={toggleNotifications} className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                <BellIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                {unreadNotificationsCount > 0 && (
                    <span className="absolute top-1 right-1.5 block h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white dark:border-dark-card" />
                )}
            </button>
            {isNotificationsOpen && (
                <NotificationsPopover 
                    notifications={notifications}
                    permission={notificationPermission}
                    onMarkAllRead={onMarkAllNotificationsAsRead}
                    onRequestPermission={onRequestNotificationPermission}
                    onClose={() => setNotificationsOpen(false)}
                />
            )}
          </div>
          
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
            <button onClick={toggleUserMenu} className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
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
                            <div key={prop.id} className="group flex items-center justify-between hover:bg-gray-100 dark:hover:bg-slate-700">
                                <a
                                    href="#"
                                    onClick={(e) => { e.preventDefault(); onSelectProperty(prop.id); setUserMenuOpen(false); }}
                                    className={`flex-grow block px-4 py-2 text-sm ${selectedPropertyId === prop.id ? 'font-bold text-primary dark:text-indigo-400' : 'text-gray-700 dark:text-gray-300'}`}
                                >
                                    {prop.name}
                                </a>
                                <button
                                    onClick={() => { onDeletePropertyClick(prop); setUserMenuOpen(false); }}
                                    className="opacity-0 group-hover:opacity-100 p-2 mr-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-opacity"
                                    aria-label={`Delete ${prop.name}`}
                                >
                                    <DeleteIcon className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                         <button onClick={() => { onAddPropertyClick(); setUserMenuOpen(false); }} className="w-full text-left block px-4 py-2 text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700">+ Add Property</button>
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
