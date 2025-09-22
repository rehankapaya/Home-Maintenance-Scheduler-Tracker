
import React from 'react';
import { Task, Priority } from '../types';
import CategoryIcon, { EditIcon, DeleteIcon, CheckCircleIcon } from './icons';

interface TaskCardProps {
  task: Task;
  onDelete: (taskId: string) => void;
  onToggleComplete: (taskId: string) => void;
  onEdit: (task: Task) => void;
}

const priorityStyles: { [key in Priority]: { bg: string; text: string; border: string } } = {
  [Priority.Urgent]: { bg: 'bg-red-100 dark:bg-red-900/50', text: 'text-red-700 dark:text-red-300', border: 'border-red-500' },
  [Priority.Medium]: { bg: 'bg-yellow-100 dark:bg-yellow-900/50', text: 'text-yellow-700 dark:text-yellow-300', border: 'border-yellow-500' },
  [Priority.Low]: { bg: 'bg-green-100 dark:bg-green-900/50', text: 'text-green-700 dark:text-green-300', border: 'border-green-500' },
};

export const TaskCard: React.FC<TaskCardProps> = ({ task, onDelete, onToggleComplete, onEdit }) => {
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
        {task.notes && <p className="text-sm text-gray-600 dark:text-gray-300 mt-3">{task.notes}</p>}
      </div>

      <div className="bg-gray-50 dark:bg-slate-800/50 px-5 py-3 rounded-b-lg">
        <div className="flex justify-between items-center">
          <div className="text-sm">
            {task.completed ? (
              <p className="text-green-600 dark:text-green-400 font-medium">Completed: {formattedCompletedDate}</p>
            ) : (
              <p className={`font-medium ${isOverdue ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-300'}`}>
                Due: {formattedDueDate}
              </p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {!task.completed && (
                <button onClick={() => onToggleComplete(task.id)} className="p-1.5 text-green-500 hover:text-green-700 dark:hover:text-green-300 rounded-full hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors" title="Mark as complete">
                    <CheckCircleIcon className="w-5 h-5" />
                </button>
            )}
            <button onClick={() => onEdit(task)} className="p-1.5 text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors" title="Edit Task">
              <EditIcon className="w-5 h-5" />
            </button>
            <button onClick={() => onDelete(task.id)} className="p-1.5 text-gray-500 hover:text-red-600 dark:hover:text-red-400 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors" title="Delete Task">
              <DeleteIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
