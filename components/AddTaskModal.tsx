
import React, { useState, useEffect } from 'react';
import { Task, Category, Priority } from '../types';
import { CATEGORY_OPTIONS, PRIORITY_OPTIONS } from '../constants';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: Omit<Task, 'id' | 'propertyId' | 'completed' | 'completedDate'>) => void;
  onEditTask: (task: Task) => void;
  taskToEdit?: Task;
}

const today = new Date().toISOString().split('T')[0];

export const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose, onAddTask, onEditTask, taskToEdit }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>(Category.General);
  const [priority, setPriority] = useState<Priority>(Priority.Medium);
  const [dueDate, setDueDate] = useState(today);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (taskToEdit) {
      setName(taskToEdit.name);
      setCategory(taskToEdit.category);
      setPriority(taskToEdit.priority);
      setDueDate(taskToEdit.dueDate);
      setNotes(taskToEdit.notes || '');
    } else {
      // Reset form for new task
      setName('');
      setCategory(Category.General);
      setPriority(Priority.Medium);
      setDueDate(today);
      setNotes('');
    }
  }, [taskToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (taskToEdit) {
      onEditTask({ ...taskToEdit, name, category, priority, dueDate, notes });
    } else {
      onAddTask({
        name,
        category,
        priority,
        dueDate,
        notes,
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white dark:bg-dark-card rounded-lg shadow-xl w-full max-w-lg m-4 max-h-full overflow-y-auto">
        <div className="p-6 border-b dark:border-slate-700">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{taskToEdit ? 'Edit Task' : 'Add New Task'}</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Task Name</label>
              <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-slate-800 dark:text-white"/>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                <select id="category" value={category} onChange={e => setCategory(e.target.value as Category)} className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-slate-800 dark:text-white">
                  {CATEGORY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
                <select id="priority" value={priority} onChange={e => setPriority(e.target.value as Priority)} className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-slate-800 dark:text-white">
                  {PRIORITY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            </div>
            <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Due Date</label>
                <input type="date" id="dueDate" value={dueDate} min={today} onChange={e => setDueDate(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-slate-800 dark:text-white"/>
            </div>
            <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes (Optional)</label>
                <textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-slate-800 dark:text-white"></textarea>
            </div>
          </div>
          <div className="px-6 py-4 bg-gray-50 dark:bg-slate-800/50 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md hover:bg-gray-50 dark:hover:bg-slate-600">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-indigo-700">{taskToEdit ? 'Save Changes' : 'Add Task'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};
