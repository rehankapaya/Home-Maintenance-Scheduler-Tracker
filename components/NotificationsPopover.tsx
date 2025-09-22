import React from 'react';
import { AppNotification, NotificationType } from '../types';
import { ClockIcon, ExclamationTriangleIcon, BellIcon, ShieldCheckIcon } from './icons';

interface NotificationsPopoverProps {
  notifications: AppNotification[];
  permission: NotificationPermission;
  onMarkAllRead: () => void;
  onRequestPermission: () => void;
  onClose: () => void;
}

const NotificationIcon: React.FC<{ type: NotificationType }> = ({ type }) => {
  switch (type) {
    case NotificationType.Overdue:
      return (
        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-red-100 dark:bg-red-900/50">
          <ExclamationTriangleIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
        </div>
      );
    case NotificationType.Upcoming:
      return (
        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-100 dark:bg-blue-900/50">
          <ClockIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
      );
    case NotificationType.Warranty:
        return (
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-100 dark:bg-green-900/50">
            <ShieldCheckIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
        );
    default:
        return null;
  }
};


export const NotificationsPopover: React.FC<NotificationsPopoverProps> = ({ notifications, permission, onMarkAllRead, onRequestPermission, onClose }) => {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-dark-card rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
      <div className="px-4 py-3 border-b dark:border-slate-700 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Notifications</h3>
        {unreadCount > 0 && (
          <button
            onClick={onMarkAllRead}
            className="text-xs font-medium text-primary hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            Mark all as read
          </button>
        )}
      </div>
      <div className="max-h-96 overflow-y-auto">
        {permission !== 'granted' && (
          <div className="p-4 border-b dark:border-slate-700">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Get desktop notifications to stay on top of your tasks.</p>
              <button
                onClick={onRequestPermission}
                disabled={permission === 'denied'}
                className="w-full px-3 py-1.5 text-sm font-semibold text-white bg-primary rounded-md hover:bg-indigo-700 disabled:bg-gray-400 dark:disabled:bg-slate-600"
              >
                {permission === 'denied' ? 'Permissions Denied' : 'Enable Notifications'}
              </button>
          </div>
        )}

        {notifications.length === 0 ? (
          <div className="text-center py-12 px-4">
            <BellIcon className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600" />
            <p className="mt-2 text-sm font-medium text-gray-500 dark:text-gray-400">No new notifications</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">You're all caught up!</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-slate-700">
            {notifications.map(notification => (
              <li key={notification.id} className={`p-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 ${!notification.read ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''}`}>
                <div className="flex items-start space-x-3">
                  <NotificationIcon type={notification.type} />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{notification.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{notification.message}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {new Date(notification.date).toLocaleString()}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};