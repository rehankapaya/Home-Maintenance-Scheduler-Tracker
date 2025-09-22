import React, { useEffect } from 'react';
import { Badge } from '../types';
import { SparklesIcon, CalendarIcon, CheckCircleIcon, TrophyIcon, ShieldCheckIcon, XMarkIcon } from './icons';

interface BadgeUnlockedToastProps {
  badge: Badge;
  onClose: () => void;
}

const BadgeIcon: React.FC<{ icon: Badge['icon'], className?: string }> = ({ icon, className = "w-10 h-10" }) => {
    switch (icon) {
        case 'Sparkles': return <SparklesIcon className={className} />;
        case 'CalendarDays': return <CalendarIcon className={className} />;
        case 'CheckBadge': return <CheckCircleIcon className={className} />;
        case 'Trophy': return <TrophyIcon className={className} />;
        default: return <ShieldCheckIcon className={className} />;
    }
};

export const BadgeUnlockedToast: React.FC<BadgeUnlockedToastProps> = ({ badge, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Auto-dismiss after 5 seconds
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div 
        className="fixed bottom-5 right-5 z-50 bg-white dark:bg-dark-card shadow-2xl rounded-xl border-l-4 border-yellow-400 w-full max-w-sm overflow-hidden animate-fade-in-up"
        role="alert"
        aria-live="assertive"
    >
        <div className="p-4 flex items-start space-x-4">
            <div className="flex-shrink-0 text-yellow-500 dark:text-yellow-400">
                <BadgeIcon icon={badge.icon} className="w-12 h-12" />
            </div>
            <div className="flex-1">
                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">BADGE UNLOCKED!</p>
                <p className="font-bold text-lg text-gray-900 dark:text-white">{badge.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{badge.description}</p>
            </div>
            <div className="flex-shrink-0">
                <button 
                    onClick={onClose} 
                    className="p-1.5 rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-primary"
                    aria-label="Close notification"
                >
                    <XMarkIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
        <div className="h-1 bg-yellow-400 animate-progress-bar"></div>
    </div>
  );
};

// Add these keyframes and animations to your global CSS or a style tag if needed
const styles = `
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes progress-bar {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}
.animate-fade-in-up {
  animation: fade-in-up 0.5s ease-out forwards;
}
.animate-progress-bar {
  animation: progress-bar 5s linear forwards;
}
`;

// A simple component to inject the styles
const StyleInjector: React.FC = () => <style>{styles}</style>;

// You can either add the styles to your index.html/global CSS, 
// or render <StyleInjector /> somewhere in your app. 
// For this component, let's just assume the CSS is available globally.
// If it's not, you can wrap the toast in a component that also renders StyleInjector.
