
import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { AddTaskModal } from './components/AddTaskModal';
import { AISuggestionsModal } from './components/AISuggestionsModal';
import { Task } from './types';
import { INITIAL_TASKS } from './constants';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [isAddTaskModalOpen, setAddTaskModalOpen] = useState(false);
  const [isAISuggestionsModalOpen, setAISuggestionsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | undefined>(undefined);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleToggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const handleAddTask = (task: Task) => {
    setTasks(prevTasks => [...prevTasks, task]);
    setAddTaskModalOpen(false);
  };

  const handleEditTask = (updatedTask: Task) => {
    setTasks(tasks.map(task => (task.id === updatedTask.id ? updatedTask : task)));
    setTaskToEdit(undefined);
    setAddTaskModalOpen(false);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleToggleComplete = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed, completedDate: !task.completed ? new Date().toISOString() : undefined } : task
    ));
  };

  const openEditModal = useCallback((task: Task) => {
    setTaskToEdit(task);
    setAddTaskModalOpen(true);
  }, []);

  const openAddModal = useCallback(() => {
    setTaskToEdit(undefined);
    setAddTaskModalOpen(true);
  }, []);
  
  const addSuggestedTasks = (newTasks: Omit<Task, 'id' | 'completed'>[]) => {
    const tasksToAdd: Task[] = newTasks.map(task => ({
      ...task,
      id: `task-${Date.now()}-${Math.random()}`,
      completed: false,
    }));
    setTasks(prev => [...prev, ...tasksToAdd]);
    setAISuggestionsModalOpen(false);
  };

  return (
    <div className="flex h-screen bg-light-bg dark:bg-dark-bg text-gray-800 dark:text-dark-text font-sans">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          onAddTaskClick={openAddModal} 
          onAISuggestionsClick={() => setAISuggestionsModalOpen(true)}
          onMenuClick={() => setSidebarOpen(!isSidebarOpen)}
          isDarkMode={isDarkMode}
          onToggleTheme={handleToggleTheme}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 lg:p-8">
          <Dashboard 
            tasks={tasks} 
            onDelete={handleDeleteTask} 
            onToggleComplete={handleToggleComplete}
            onEdit={openEditModal}
          />
        </main>
      </div>

      {isAddTaskModalOpen && (
        <AddTaskModal 
          isOpen={isAddTaskModalOpen}
          onClose={() => { setAddTaskModalOpen(false); setTaskToEdit(undefined); }}
          onAddTask={handleAddTask}
          onEditTask={handleEditTask}
          taskToEdit={taskToEdit}
        />
      )}

      {isAISuggestionsModalOpen && (
        <AISuggestionsModal
          isOpen={isAISuggestionsModalOpen}
          onClose={() => setAISuggestionsModalOpen(false)}
          onAddTasks={addSuggestedTasks}
        />
      )}
    </div>
  );
};

export default App;
