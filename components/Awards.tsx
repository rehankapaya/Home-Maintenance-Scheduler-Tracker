import React from 'react';
import { User, Badge } from '../types';
import { ALL_BADGES } from '../constants';
import { SparklesIcon, CalendarIcon, CheckCircleIcon, TrophyIcon, ShieldCheckIcon } from './icons';

interface AwardsProps {
    user: User;
}

const getLevel = (points: number) => {
    if (points < 100) return { name: 'Newcomer', next: 100, progress: (points / 100) * 100 };
    if (points < 250) return { name: 'Apprentice', next: 250, progress: ((points-100) / 150) * 100 };
    if (points < 500) return { name: 'Homeowner', next: 500, progress: ((points-250) / 250) * 100 };
    if (points < 1000) return { name: 'Maintenance Pro', next: 1000, progress: ((points-500) / 500) * 100 };
    return { name: 'Maintenance Champion', next: null, progress: 100 };
};

const BadgeIcon: React.FC<{ icon: Badge['icon'], className?: string }> = ({ icon, className = "w-10 h-10" }) => {
    switch (icon) {
        case 'Sparkles': return <SparklesIcon className={className} />;
        case 'CalendarDays': return <CalendarIcon className={className} />;
        case 'CheckBadge': return <CheckCircleIcon className={className} />;
        case 'Trophy': return <TrophyIcon className={className} />;
        default: return <ShieldCheckIcon className={className} />;
    }
};


const BadgeCard: React.FC<{ badge: Badge; isUnlocked: boolean }> = ({ badge, isUnlocked }) => {
    return (
        <div className={`
            p-6 rounded-lg text-center flex flex-col items-center justify-start
            transition-all duration-300 transform
            ${isUnlocked 
                ? 'bg-white dark:bg-dark-card shadow-md hover:shadow-lg hover:-translate-y-1' 
                : 'bg-gray-100 dark:bg-slate-800/50'
            }
        `}>
            <div className={`
                w-20 h-20 rounded-full flex items-center justify-center mb-4
                transition-colors duration-300
                ${isUnlocked 
                    ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-500 dark:text-yellow-400' 
                    : 'bg-gray-200 dark:bg-slate-700 text-gray-400 dark:text-gray-500'
                }
            `}>
                <BadgeIcon icon={badge.icon} className="w-10 h-10" />
            </div>
            <h3 className={`font-bold text-lg ${isUnlocked ? 'text-gray-800 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                {badge.name}
            </h3>
            <p className={`text-sm mt-1 ${isUnlocked ? 'text-gray-600 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'}`}>
                {badge.description}
            </p>
        </div>
    );
};

export const Awards: React.FC<AwardsProps> = ({ user }) => {
    const levelInfo = getLevel(user.points);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Your Awards</h1>
                <p className="text-gray-500 dark:text-gray-400">Track your progress and celebrate your maintenance milestones!</p>
            </div>

            <div className="bg-white dark:bg-dark-card shadow-lg rounded-xl p-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="text-center md:text-left">
                         <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Level</p>
                         <h2 className="text-4xl font-extrabold text-primary">{levelInfo.name}</h2>
                    </div>
                     <div className="text-center">
                         <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Points</p>
                         <p className="text-5xl font-bold text-gray-800 dark:text-white">{user.points}</p>
                    </div>
                     <div className="w-full md:w-1/3">
                        <div className="flex justify-between text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                            <span>Progress to Next Level</span>
                            {levelInfo.next && <span>{user.points} / {levelInfo.next}</span>}
                        </div>
                         <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-4">
                            <div className="bg-secondary h-4 rounded-full transition-all duration-500" style={{width: `${levelInfo.progress}%`}}></div>
                         </div>
                    </div>
                </div>
            </div>

            <div>
                 <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Badges</h2>
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {ALL_BADGES.map(badge => (
                        <BadgeCard 
                            key={badge.id} 
                            badge={badge} 
                            isUnlocked={user.unlockedBadges.includes(badge.id)} 
                        />
                    ))}
                 </div>
            </div>
        </div>
    );
};
