
import React from 'react';
import { Task, ServiceProvider, PersonalizedRecommendation, Tenant } from '../types';
import { TaskCard } from './TaskCard';
import { ExclamationTriangleIcon, ClockIcon, CheckCircleIcon, CalendarIcon, LightBulbIcon, PlusIcon, XMarkIcon, HomeIcon } from './icons';

interface DashboardProps {
  tasks: Task[];
  serviceProviders: ServiceProvider[];
  tenants: Tenant[];
  onDelete: (taskId: string) => void;
  onToggleComplete: (taskId: string) => void;
  onEdit: (task: Task) => void;
  recommendations: PersonalizedRecommendation[];
  isRecsLoading: boolean;
  onDismissRecommendation: (taskName: string) => void;
  onAddTaskFromRecommendation: (rec: PersonalizedRecommendation) => void;
  isOnline: boolean;
  hasProperties: boolean;
  onAddProperty: () => void;
}

const RecommendationCard: React.FC<{
    recommendation: PersonalizedRecommendation;
    onDismiss: (taskName: string) => void;
    onAddTask: (rec: PersonalizedRecommendation) => void;
}> = ({ recommendation, onDismiss, onAddTask }) => {
    return (
        <div className="bg-white dark:bg-dark-card rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col border-l-4 border-indigo-500">
            <div className="p-5 flex-grow">
                <div className="flex justify-between items-start">
                     <div className="flex items-center space-x-3">
                        <LightBulbIcon className="w-7 h-7 text-indigo-500 flex-shrink-0" />
                         <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{recommendation.taskName}</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{recommendation.category} &bull; {recommendation.priority}</p>
                        </div>
                     </div>
                </div>
                 <p className="text-sm text-gray-600 dark:text-gray-300 mt-3 italic">
                    &ldquo;{recommendation.reason}&rdquo;
                </p>
            </div>
             <div className="bg-gray-50 dark:bg-slate-800/50 px-5 py-3 rounded-b-lg mt-auto flex justify-end items-center space-x-2">
                <button onClick={() => onDismiss(recommendation.taskName)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition-colors p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700" aria-label="Dismiss recommendation">
                    <XMarkIcon className="w-5 h-5" />
                </button>
                <button onClick={() => onAddTask(recommendation)} className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-white bg-primary rounded-md hover:bg-green-700 transition-colors">
                    <PlusIcon className="w-4 h-4" />
                    <span>Add Task</span>
                </button>
            </div>
        </div>
    );
};

const TaskList: React.FC<{
    title: string, 
    tasks: Task[], 
    providerMap: Map<string, ServiceProvider>,
    tenantMap: Map<string, Tenant>,
    onDelete: (taskId: string) => void, 
    onToggleComplete: (taskId: string) => void, 
    onEdit: (task: Task) => void
}> = ({ title, tasks, providerMap, tenantMap, onDelete, onToggleComplete, onEdit }) => (
    <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">{title} ({tasks.length})</h2>
        {tasks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tasks.map(task => {
                const serviceProvider = task.serviceProviderId ? providerMap.get(task.serviceProviderId) : undefined;
                const tenant = task.tenantId ? tenantMap.get(task.tenantId) : undefined;
                return (
                    <TaskCard 
                        key={task.id} 
                        task={task} 
                        serviceProvider={serviceProvider}
                        tenant={tenant}
                        onDelete={onDelete}
                        onToggleComplete={onToggleComplete}
                        onEdit={onEdit}
                    />
                );
            })}
            </div>
        ) : (
            <div className="text-center py-12 px-6 bg-white dark:bg-dark-card rounded-lg shadow-sm">
                <p className="text-gray-500 dark:text-gray-400">No tasks here. Enjoy the quiet time!</p>
            </div>
        )}
    </div>
);

const StatsCard: React.FC<{ icon: React.ReactNode; label: string; value: number | string; color: string; }> = ({ icon, label, value, color }) => (
    <div className={`bg-white dark:bg-dark-card p-5 rounded-lg shadow-sm flex items-center space-x-4 border-l-4 ${color}`}>
        <div className="flex-shrink-0">{icon}</div>
        <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
    </div>
);

export const Dashboard: React.FC<DashboardProps> = ({ 
    tasks, serviceProviders, tenants, onDelete, onToggleComplete, onEdit, 
    recommendations, isRecsLoading, onDismissRecommendation, onAddTaskFromRecommendation,
    isOnline, hasProperties, onAddProperty
}) => {
  if (!hasProperties) {
    return (
        <div className="text-center py-16 px-6 bg-white dark:bg-dark-card rounded-lg shadow-sm flex flex-col items-center h-full justify-center">
            <HomeIcon className="w-20 h-20 mx-auto text-gray-300 dark:text-gray-600" />
            <h2 className="mt-4 text-2xl font-bold text-gray-800 dark:text-white">Welcome to Homegevity!</h2>
            <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">
                It looks like you don't have any properties yet.
            </p>
             <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
                Add a property to start managing your maintenance tasks.
            </p>
            <button
                onClick={onAddProperty}
                className="mt-8 flex items-center mx-auto space-x-2 px-6 py-3 text-base font-medium text-white bg-primary rounded-md hover:bg-green-700 transition-colors shadow-sm"
            >
                <PlusIcon className="w-5 h-5" />
                <span>Add Your First Property</span>
            </button>
        </div>
    );
  }

  const upcomingTasks = tasks.filter(task => !task.completed).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  const completedTasks = tasks.filter(task => task.completed).sort((a, b) => new Date(b.completedDate!).getTime() - new Date(a.completedDate!).getTime());
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const overdueTasksCount = tasks.filter(t => !t.completed && new Date(t.dueDate) < today).length;
  
  const sevenDaysFromNow = new Date(today);
  sevenDaysFromNow.setDate(today.getDate() + 7);
  const upcomingTasksCount = tasks.filter(t => !t.completed && new Date(t.dueDate) >= today && new Date(t.dueDate) <= sevenDaysFromNow).length;
  
  const totalIncomplete = tasks.filter(t => !t.completed).length;

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentlyCompleted = tasks.filter(t => t.completed && t.completedDate && new Date(t.completedDate) >= thirtyDaysAgo).length;

  const providerMap = new Map(serviceProviders.map(p => [p.id, p]));
  const tenantMap = new Map(tenants.map(t => [t.id, t]));

  return (
    <div className="space-y-10">
        <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">At a Glance</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard 
                    icon={<ExclamationTriangleIcon className="w-8 h-8 text-red-500" />} 
                    label="Overdue" 
                    value={overdueTasksCount} 
                    color="border-red-500"
                />
                <StatsCard 
                    icon={<ClockIcon className="w-8 h-8 text-blue-500" />} 
                    label="Upcoming (7 days)" 
                    value={upcomingTasksCount} 
                    color="border-blue-500"
                />
                <StatsCard 
                    icon={<CalendarIcon className="w-8 h-8 text-yellow-500" />} 
                    label="Total Incomplete" 
                    value={totalIncomplete} 
                    color="border-yellow-500"
                />
                <StatsCard 
                    icon={<CheckCircleIcon className="w-8 h-8 text-green-500" />} 
                    label="Completed (30 days)" 
                    value={recentlyCompleted} 
                    color="border-green-500"
                />
            </div>
        </div>

        <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">AI Recommendations</h2>
            {!isOnline ? (
                 <div className="text-center py-12 px-6 bg-white dark:bg-dark-card rounded-lg shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M11.25 4.5C6.44 4.5 2.25 8.055 1.5 12.75a11.12 11.12 0 0 0 3.39 5.25m3.359-3.359a3.375 3.375 0 0 1 4.242-4.242" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 19.5a11.12 11.12 0 0 0 8.858-5.25c-.75-4.695-4.94-8.25-9.75-8.25a11.085 11.085 0 0 0-2.25.316m-3.359 3.359a11.125 11.125 0 0 0-3.39 5.25c.75 4.695 4.94 8.25 9.75 8.25 1.345 0 2.64-.22 3.86-.632" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 10.5a3.375 3.375 0 0 1-4.242 4.242" />
                    </svg>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">AI Recommendations are unavailable offline.</p>
                </div>
            ) : isRecsLoading ? (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Analyzing your home and tasks...</p>
                </div>
            ) : recommendations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recommendations.map(rec => (
                        <RecommendationCard
                            key={rec.taskName}
                            recommendation={rec}
                            onDismiss={onDismissRecommendation}
                            onAddTask={onAddTaskFromRecommendation}
                        />
                    ))}
                </div>
            ) : (
                 <div className="text-center py-12 px-6 bg-white dark:bg-dark-card rounded-lg shadow-sm">
                    <LightBulbIcon className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600" />
                    <p className="mt-2 text-gray-500 dark:text-gray-400">No specific recommendations for now. You're on top of things!</p>
                </div>
            )}
        </div>

      <TaskList 
        title="Upcoming & Overdue"
        tasks={upcomingTasks}
        providerMap={providerMap}
        tenantMap={tenantMap}
        onDelete={onDelete}
        onToggleComplete={onToggleComplete}
        onEdit={onEdit}
      />
      <TaskList 
        title="Completed"
        tasks={completedTasks}
        providerMap={providerMap}
        tenantMap={tenantMap}
        onDelete={onDelete}
        onToggleComplete={onToggleComplete}
        onEdit={onEdit}
      />
    </div>
  );
};