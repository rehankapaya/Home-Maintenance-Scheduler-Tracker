import React from 'react';
import { Task, Priority, RecurrenceRule, ServiceProvider, Tenant } from '../types';
import CategoryIcon, { EditIcon, DeleteIcon, CheckCircleIcon, RepeatIcon, UserIcon, PaperclipIcon, UserGroupIcon, CurrencyDollarIcon } from './icons';

interface TaskCardProps {
  task: Task;
  serviceProvider?: ServiceProvider;
  tenant?: Tenant;
  onDelete: (taskId: string) => void;
  onToggleComplete: (taskId: string) => void;
  onEdit: (task: Task) => void;
}

const priorityStyles: { [key in Priority]: { bg: string; text: string; border: string } } = {
  [Priority.Urgent]: { bg: 'bg-red-100 dark:bg-red-900/50', text: 'text-red-700 dark:text-red-300', border: 'border-red-500' },
  [Priority.Medium]: { bg: 'bg-yellow-100 dark:bg-yellow-900/50', text: 'text-yellow-700 dark:text-yellow-300', border: 'border-yellow-500' },
  [Priority.Low]: { bg: 'bg-green-100 dark:bg-green-900/50', text: 'text-green-700 dark:text-green-300', border: 'border-green-500' },
};

export const TaskCard: React.FC<TaskCardProps> = ({ task, serviceProvider, tenant, onDelete, onToggleComplete, onEdit }) => {
  const { bg, text, border } = priorityStyles[task.priority];
  const isOverdue = !task.completed && new Date(task.dueDate) < new Date();

  const formattedDueDate = new Date(task.dueDate + 'T00:00:00').toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  
  const formattedCompletedDate = task.completedDate ? new Date(task.completedDate).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }) : '';


  return (
    <div className={`bg-white dark:bg-dark-card rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border-l-4 ${task.completed ? 'border-gray-300 dark:border-slate-600 opacity-70' : border} flex flex-col`}>
      <div className="p-5 flex-grow">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <CategoryIcon category={task.category} className="w-7 h-7 text-gray-500 dark:text-gray-400" />
            <div>
                <h3 className={`text-lg font-bold ${task.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>{task.name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">{task.category}</p>
            </div>
          </div>
          <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${bg} ${text}`}>{task.priority}</span>
        </div>
        {task.notes && <p className="text-sm text-gray-600 dark:text-gray-300 mt-3 break-words">{task.notes}</p>}
      </div>

      <div className="bg-gray-50 dark:bg-slate-800/50 px-5 py-3 rounded-b-lg mt-auto">
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm space-y-1">
            {task.completed ? (
                 <p className="text-green-600 dark:text-green-400 font-medium">Completed: {formattedCompletedDate}</p>
            ) : (
                <p className={`font-medium ${isOverdue ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'}`}>
                    Due: {formattedDueDate}
                </p>
            )}
            {tenant && (
                <div className="flex items-center space-x-1.5 text-gray-500 dark:text-gray-400">
                    <UserIcon className="w-4 h-4" />
                    <span>{tenant.name}</span>
                </div>
            )}
            {serviceProvider && (
                <div className="flex items-center space-x-1.5 text-gray-500 dark:text-gray-400">
                    <UserGroupIcon className="w-4 h-4" />
                    <span>{serviceProvider.name}</span>
                </div>
            )}
            {task.completed && task.cost && (
                 <div className="flex items-center space-x-1.5 text-gray-600 dark:text-gray-300 font-semibold">
                    <CurrencyDollarIcon className="w-4 h-4" />
                    <span>{task.cost.toFixed(2)}</span>
                </div>
            )}
          </div>
          <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
            {task.recurrence && task.recurrence !== RecurrenceRule.None && (
                <RepeatIcon className="w-5 h-5" title={`Repeats ${task.recurrence}`} />
            )}
            {task.attachments && task.attachments.length > 0 && (
                 <div className="flex items-center space-x-1" title={`${task.attachments.length} attachments`}>
                    <PaperclipIcon className="w-5 h-5" />
                    <span className="text-xs font-bold">{task.attachments.length}</span>
                 </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-between items-center border-t dark:border-slate-700 pt-3">
            <button onClick={() => onToggleComplete(task.id)} className={`flex items-center space-x-2 text-sm font-medium transition-colors ${
                task.completed ? 'text-yellow-600 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300' 
                                : 'text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300'
            }`}>
                <CheckCircleIcon className="w-5 h-5" />
                <span>{task.completed ? 'Undo' : 'Complete'}</span>
            </button>
            <div className="flex items-center space-x-2">
                <button onClick={() => onEdit(task)} className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors" aria-label="Edit Task">
                    <EditIcon className="w-5 h-5" />
                </button>
                <button onClick={() => onDelete(task.id)} className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors" aria-label="Delete Task">
                    <DeleteIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};