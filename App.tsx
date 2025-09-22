
import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { AddTaskModal } from './components/AddTaskModal';
import { AISuggestionsModal } from './components/AISuggestionsModal';
import { LoginScreen } from './components/LoginScreen';
import { Task, User } from './types';
import { INITIAL_TASKS, MOCK_USER } from './constants';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [isAddTaskModalOpen, setAddTaskModalOpen] = useState(false);
  const [isAISuggestionsModalOpen, setAISuggestionsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | undefined>(undefined);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // In a real app, you'd check a token here. For this demo, we start at the login screen.
    // To skip login and go straight to the dashboard, uncomment the following two lines:
    // setCurrentUser(MOCK_USER);
    // setSelectedPropertyId(MOCK_USER.properties[0]?.id);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);
  
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    if (user.properties.length > 0) {
      setSelectedPropertyId(user.properties[0].id);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSelectedPropertyId(null);
  };

  const handleToggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const handleAddTask = (task: Omit<Task, 'id' | 'propertyId' | 'completed' | 'completedDate'>) => {
    if (!selectedPropertyId) return;
    const newTask: Task = {
        ...task,
        id: `task-${Date.now()}`,
        propertyId: selectedPropertyId,
        completed: false,
    };
    setTasks(prevTasks => [...prevTasks, newTask]);
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
  
  const addSuggestedTasks = (newTasks: Omit<Task, 'id' | 'completed' | 'propertyId' | 'completedDate'>[]) => {
    if (!selectedPropertyId) return;
    const tasksToAdd: Task[] = newTasks.map(task => ({
      ...task,
      id: `task-${Date.now()}-${Math.random()}`,
      propertyId: selectedPropertyId,
      completed: false,
    }));
    setTasks(prev => [...prev, ...tasksToAdd]);
    setAISuggestionsModalOpen(false);
  };

  if (!currentUser) {
    return <LoginScreen onLogin={() => handleLogin(MOCK_USER)} />;
  }

  const displayedTasks = tasks.filter(task => task.propertyId === selectedPropertyId);

  return (
    <div className="flex h-screen bg-light-bg dark:bg-dark-bg text-gray-800 dark:text-dark-text font-sans">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          user={currentUser}
          properties={currentUser.properties}
          selectedPropertyId={selectedPropertyId}
          onSelectProperty={setSelectedPropertyId}
          onLogout={handleLogout}
          onAddTaskClick={openAddModal} 
          onAISuggestionsClick={() => setAISuggestionsModalOpen(true)}
          onMenuClick={() => setSidebarOpen(!isSidebarOpen)}
          isDarkMode={isDarkMode}
          onToggleTheme={handleToggleTheme}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 lg:p-8">
          <Dashboard 
            tasks={displayedTasks} 
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
