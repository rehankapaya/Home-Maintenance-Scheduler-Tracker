
import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { AddTaskModal } from './components/AddTaskModal';
import { AISuggestionsModal } from './components/AISuggestionsModal';
import { LoginScreen } from './components/LoginScreen';
import { ServiceProviders } from './components/ServiceProviders';
import { Inventory } from './components/Inventory';
import { Task, User, RecurrenceRule, AppNotification, NotificationType, ServiceProvider, InventoryItem, Attachment, Property, PersonalizedRecommendation, Tenant, Priority, Badge, SyncStatus, UserRole } from './types';
import { INITIAL_TASKS, MOCK_USER, MOCK_SERVICE_PROVIDERS, MOCK_INVENTORY_ITEMS, MOCK_TENANTS, ALL_BADGES } from './constants';
import { ServiceProviderModal } from './components/ServiceProviderModal';
import { InventoryItemModal } from './components/InventoryItemModal';
import { Reports } from './components/Reports';
import { generatePersonalizedRecommendations } from './services/geminiService';
import { Tenants } from './components/Tenants';
import { TenantModal } from './components/TenantModal';
import { Awards } from './components/Awards';
import { BadgeUnlockedToast } from './components/BadgeUnlockedToast';
import { AddPropertyModal } from './components/AddPropertyModal';

type ActiveView = 'dashboard' | 'providers' | 'inventory' | 'reports' | 'tenants' | 'awards';

// Helper to safely get initial state from localStorage
function getInitialState<T>(key: string, defaultValue: T): T {
    try {
        const savedItem = localStorage.getItem(key);
        if (savedItem) {
            return JSON.parse(savedItem);
        }
    } catch (error) {
        console.error(`Error reading ${key} from localStorage`, error);
    }
    return defaultValue;
}

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Persisted state
  const [tasks, setTasks] = useState<Task[]>(() => getInitialState('homely-tasks', INITIAL_TASKS));
  const [serviceProviders, setServiceProviders] = useState<ServiceProvider[]>(() => getInitialState('homely-serviceProviders', MOCK_SERVICE_PROVIDERS));
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(() => getInitialState('homely-inventoryItems', MOCK_INVENTORY_ITEMS));
  const [tenants, setTenants] = useState<Tenant[]>(() => getInitialState('homely-tenants', MOCK_TENANTS));
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => getInitialState('homely-isDarkMode', false));
  const [userStore, setUserStore] = useState<Record<string, User>>(() => {
    const storedUsers = getInitialState<Record<string, User>>('homely-userStore', {});
    // Ensure the mock user exists for demo purposes if the store is empty
    if (Object.keys(storedUsers).length === 0) {
      return { [MOCK_USER.id]: MOCK_USER };
    }
    return storedUsers;
  });

  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  
  // Modal states
  const [isAddTaskModalOpen, setAddTaskModalOpen] = useState(false);
  const [isAISuggestionsModalOpen, setAISuggestionsModalOpen] = useState(false);
  const [isProviderModalOpen, setProviderModalOpen] = useState(false);
  const [isInventoryModalOpen, setInventoryModalOpen] = useState(false);
  const [isTenantModalOpen, setTenantModalOpen] = useState(false);
  const [isAddPropertyModalOpen, setAddPropertyModalOpen] = useState(false);
  
  // Edit states
  const [taskToEdit, setTaskToEdit] = useState<Task | undefined>(undefined);
  const [providerToEdit, setProviderToEdit] = useState<ServiceProvider | undefined>(undefined);
  const [inventoryItemToEdit, setInventoryItemToEdit] = useState<InventoryItem | undefined>(undefined);
  const [tenantToEdit, setTenantToEdit] = useState<Tenant | undefined>(undefined);
  const [initialDataForNewTask, setInitialDataForNewTask] = useState<Partial<Task> | undefined>(undefined);


  // UI States
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  
  // Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [notificationPermission, setNotificationPermission] = useState('default');

  // AI Recommendations
  const [recommendations, setRecommendations] = useState<PersonalizedRecommendation[]>([]);
  const [isRecsLoading, setIsRecsLoading] = useState(false);

  // Gamification
  const [newlyUnlockedBadge, setNewlyUnlockedBadge] = useState<Badge | null>(null);
  
  // Offline & Sync
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(navigator.onLine ? 'synced' : 'offline');


  // Effects to save state to localStorage
  useEffect(() => { localStorage.setItem('homely-tasks', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem('homely-serviceProviders', JSON.stringify(serviceProviders)); }, [serviceProviders]);
  useEffect(() => { localStorage.setItem('homely-inventoryItems', JSON.stringify(inventoryItems)); }, [inventoryItems]);
  useEffect(() => { localStorage.setItem('homely-tenants', JSON.stringify(tenants)); }, [tenants]);
  useEffect(() => { localStorage.setItem('homely-isDarkMode', JSON.stringify(isDarkMode)); }, [isDarkMode]);
  useEffect(() => { localStorage.setItem('homely-userStore', JSON.stringify(userStore)); }, [userStore]);


  // Effect for online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setSyncStatus('syncing');
      // Simulate a sync process, in a real app this would involve API calls
      setTimeout(() => {
        setSyncStatus('synced');
      }, 1500);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setSyncStatus('offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Effect to fetch personalized AI recommendations
  useEffect(() => {
    const fetchRecommendations = async () => {
        if (!currentUser || !selectedPropertyId || !isOnline) {
            if (!isOnline) {
                setRecommendations([]); // Clear recommendations when offline
            }
            return;
        }

        const currentProperty = currentUser.properties.find(p => p.id === selectedPropertyId);
        if (!currentProperty) return;

        setIsRecsLoading(true);
        try {
            const recs = await generatePersonalizedRecommendations(currentProperty.description, tasks);
            setRecommendations(recs);
        } catch (error) {
            console.error("Failed to fetch AI recommendations:", error);
        } finally {
            setIsRecsLoading(false);
        }
    };

    fetchRecommendations();
  }, [selectedPropertyId, tasks, currentUser, isOnline]);


  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const showBrowserNotification = useCallback((title: string, options: NotificationOptions) => {
      if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(title, options);
      }
  }, []);

  const updateNotifications = useCallback(() => {
    const finalNotifications: AppNotification[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // --- Task Notifications ---
    tasks.forEach(task => {
        if (task.completed) return;
        const dueDate = new Date(task.dueDate + 'T00:00:00');
        const diffTime = dueDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        let notificationType: NotificationType | null = null;
        let message = '';

        if (diffDays < 0) {
            notificationType = NotificationType.Overdue;
            message = `Was due on ${dueDate.toLocaleDateString()}`;
        } else if (diffDays <= 3) {
            notificationType = NotificationType.Upcoming;
            if (diffDays === 0) message = 'Due today';
            else if (diffDays === 1) message = 'Due tomorrow';
            else message = `Due in ${diffDays} days`;
        }

        if (notificationType) {
            const notifId = `notif-${task.id}-${notificationType}`;
            finalNotifications.push({
                id: notifId,
                relatedId: task.id,
                title: task.name,
                message,
                type: notificationType,
                date: notifications.find(n => n.id === notifId)?.date || new Date().toISOString(),
                read: notifications.find(n => n.id === notifId)?.read || false,
            });
        }
    });

    // --- Warranty Notifications ---
    const thirtyDaysFromNow = new Date(today);
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    inventoryItems.forEach(item => {
        if (!item.warrantyExpiryDate) return;

        const expiryDate = new Date(item.warrantyExpiryDate + 'T00:00:00');
        if (expiryDate < today || !item.propertyId || item.propertyId !== selectedPropertyId) return;

        if (expiryDate <= thirtyDaysFromNow) {
            const diffTime = expiryDate.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            let message = '';
            if (diffDays < 0) return; // Should be caught above, but as a safeguard
            if (diffDays === 0) message = 'Warranty expires today.';
            else if (diffDays === 1) message = 'Warranty expires tomorrow.';
            else message = `Warranty expires in ${diffDays} days.`;
            
            const notifId = `notif-${item.id}-${NotificationType.Warranty}`;
            finalNotifications.push({
                id: notifId,
                relatedId: item.id,
                title: item.name,
                message,
                type: NotificationType.Warranty,
                date: notifications.find(n => n.id === notifId)?.date || new Date().toISOString(),
                read: notifications.find(n => n.id === notifId)?.read || false,
            });
        }
    });

    // --- Browser Notifications ---
    finalNotifications.forEach(newNotif => {
        const oldNotif = notifications.find(old => old.id === newNotif.id);
        if (!oldNotif) { // It's a brand new notification
             const title = newNotif.type === NotificationType.Warranty ? `Warranty Alert: ${newNotif.title}` : `${newNotif.type}: ${newNotif.title}`;
             showBrowserNotification(title, { body: newNotif.message, tag: newNotif.relatedId });
        }
    });
    
    finalNotifications.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Compare to avoid unnecessary re-renders
    if (JSON.stringify(finalNotifications) !== JSON.stringify(notifications)) {
        setNotifications(finalNotifications);
    }
}, [tasks, inventoryItems, notifications, showBrowserNotification, selectedPropertyId]);

  useEffect(() => {
    updateNotifications();
  }, [tasks, inventoryItems, selectedPropertyId]);

  useEffect(() => {
      const interval = setInterval(updateNotifications, 5 * 60 * 1000);
      return () => clearInterval(interval);
  }, [updateNotifications]);

  useEffect(() => {
     // This effect will run when currentUser is set after login.
     if (currentUser && currentUser.properties.length > 0 && !selectedPropertyId) {
        setSelectedPropertyId(currentUser.properties[0].id);
     }
  }, [currentUser, selectedPropertyId]);

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) return;
    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);
  };

  const handleMarkAllNotificationsAsRead = () => {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };
  
  const handleLogin = (email: string, password?: string): boolean => {
    // FIX: Explicitly type `u` as `User` to help TypeScript's type inference.
    const user = Object.values(userStore).find(
      (u: User) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (user) {
      setCurrentUser(user);
      if (user.properties.length > 0) {
        setSelectedPropertyId(user.properties[0].id);
      } else {
        setSelectedPropertyId(null);
      }
      return true;
    }
    return false;
  };

  const handleSignup = (userData: Omit<User, 'id' | 'properties' | 'points' | 'unlockedBadges'>): User => {
    const newUser: User = {
        ...userData,
        id: `user-${Date.now()}`,
        properties: [],
        points: 0,
        unlockedBadges: [],
    };
    setUserStore(prev => ({...prev, [newUser.id]: newUser}));
    setCurrentUser(newUser);
    setSelectedPropertyId(null);
    return newUser;
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSelectedPropertyId(null);
  };

  const handleToggleTheme = () => setIsDarkMode(prev => !prev);
  
  const updateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    setUserStore(prev => ({ ...prev, [updatedUser.id]: updatedUser }));
  };

  // Add Property
  const handleAddProperty = (property: Omit<Property, 'id'>) => {
    const newProperty: Property = {
      ...property,
      id: `prop-${Date.now()}`,
    };

    setCurrentUser(prevUser => {
        if (!prevUser) return null;
        const updatedUser = {
            ...prevUser,
            properties: [...prevUser.properties, newProperty],
        };
        setUserStore(prevStore => ({ ...prevStore, [updatedUser.id]: updatedUser }));
        return updatedUser;
    });

    setSelectedPropertyId(newProperty.id); // Select the new property
    setAddPropertyModalOpen(false);
  };

  // Task CRUD
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
  
  // Service Provider CRUD
  const handleAddServiceProvider = (provider: Omit<ServiceProvider, 'id'>) => {
    const newProvider: ServiceProvider = { ...provider, id: `sp-${Date.now()}` };
    setServiceProviders(prev => [...prev, newProvider]);
    setProviderModalOpen(false);
  };
  
  const handleEditServiceProvider = (updatedProvider: ServiceProvider) => {
      setServiceProviders(providers => providers.map(p => p.id === updatedProvider.id ? updatedProvider : p));
      setProviderToEdit(undefined);
      setProviderModalOpen(false);
  };

  const handleDeleteServiceProvider = (providerId: string) => {
      setServiceProviders(providers => providers.filter(p => p.id !== providerId));
      // Also remove provider from any tasks
      setTasks(tasks => tasks.map(t => t.serviceProviderId === providerId ? { ...t, serviceProviderId: undefined } : t));
  };
  
  // Inventory CRUD
  const handleAddInventoryItem = (item: Omit<InventoryItem, 'id' | 'propertyId'>) => {
    if (!selectedPropertyId) return;
    const newItem: InventoryItem = { ...item, id: `inv-${Date.now()}`, propertyId: selectedPropertyId };
    setInventoryItems(prev => [...prev, newItem]);
    setInventoryModalOpen(false);
  };
  
  const handleEditInventoryItem = (updatedItem: InventoryItem) => {
      setInventoryItems(items => items.map(i => i.id === updatedItem.id ? updatedItem : i));
      setInventoryItemToEdit(undefined);
      setInventoryModalOpen(false);
  };
  
  const handleDeleteInventoryItem = (itemId: string) => {
      setInventoryItems(items => items.filter(i => i.id !== itemId));
  };
  
  // Tenant CRUD
  const handleAddTenant = (tenant: Omit<Tenant, 'id' | 'propertyId'>) => {
    if (!selectedPropertyId) return;
    const newTenant: Tenant = { ...tenant, id: `t-${Date.now()}`, propertyId: selectedPropertyId };
    setTenants(prev => [...prev, newTenant]);
    setTenantModalOpen(false);
  };

  const handleEditTenant = (updatedTenant: Tenant) => {
    setTenants(tenants => tenants.map(t => t.id === updatedTenant.id ? updatedTenant : t));
    setTenantToEdit(undefined);
    setTenantModalOpen(false);
  };
  
  const handleDeleteTenant = (tenantId: string) => {
    setTenants(tenants => tenants.filter(t => t.id !== tenantId));
    // Also unassign tenant from any tasks
    setTasks(tasks => tasks.map(t => t.tenantId === tenantId ? { ...t, tenantId: undefined } : t));
  };


  const calculateNextDueDate = (currentDueDate: string, rule: RecurrenceRule): string => {
    const date = new Date(currentDueDate + 'T00:00:00');
    switch (rule) {
      case RecurrenceRule.Daily: date.setDate(date.getDate() + 1); break;
      case RecurrenceRule.Weekly: date.setDate(date.getDate() + 7); break;
      case RecurrenceRule.Monthly: date.setMonth(date.getMonth() + 1); break;
      case RecurrenceRule.Seasonal: date.setMonth(date.getMonth() + 3); break;
      case RecurrenceRule.Yearly: date.setFullYear(date.getFullYear() + 1); break;
    }
    return date.toISOString().split('T')[0];
  };

  const checkAndAwardBadges = (user: User, allTasks: Task[]) => {
      let newlyAwarded: Badge | null = null;
      let updatedBadges = [...user.unlockedBadges];
      
      const completedTasks = allTasks.filter(t => t.completed);
      
      ALL_BADGES.forEach(badge => {
          if (user.unlockedBadges.includes(badge.id)) return;

          let criteriaMet = false;
          switch(badge.id) {
              case 'badge-1': // First Task Complete
                  if (completedTasks.length >= 1) criteriaMet = true;
                  break;
              case 'badge-2': // On-Time Pro
                  const onTimeCount = completedTasks.filter(t => new Date(t.completedDate!) <= new Date(t.dueDate + 'T23:59:59')).length;
                  if (onTimeCount >= 5) criteriaMet = true;
                  break;
              case 'badge-3': // Task Master
                  if (completedTasks.length >= 15) criteriaMet = true;
                  break;
              case 'badge-4': // Maintenance Champion
                  if (user.points >= 500) criteriaMet = true;
                  break;
          }

          if (criteriaMet) {
              updatedBadges.push(badge.id);
              newlyAwarded = badge; 
          }
      });
      
      if (newlyAwarded) {
          setNewlyUnlockedBadge(newlyAwarded);
      }
      return updatedBadges;
  };


  const handleToggleComplete = (taskId: string) => {
    if (!currentUser) return;
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    // --- Gamification Logic ---
    let pointsEarned = 0;
    if (!task.completed) {
        pointsEarned += 10; // Base points
        if (new Date() <= new Date(task.dueDate + 'T23:59:59')) {
            pointsEarned += 5; // On-time bonus
        }
        if (task.priority === Priority.Urgent) pointsEarned += 10;
        else if (task.priority === Priority.Medium) pointsEarned += 5;
    } else {
        // If un-completing, deduct points
        pointsEarned -= 10;
        if (new Date(task.completedDate!) <= new Date(task.dueDate + 'T23:59:59')) {
             pointsEarned -= 5;
        }
        if (task.priority === Priority.Urgent) pointsEarned -= 10;
        else if (task.priority === Priority.Medium) pointsEarned -= 5;
    }
    
    const updatedUser: User = { ...currentUser, points: currentUser.points + pointsEarned };

    // --- Task State Logic ---
    const isRecurring = task.recurrence && task.recurrence !== RecurrenceRule.None;
    let updatedTasks: Task[] = [];
    if (isRecurring && !task.completed) {
        const nextDueDate = calculateNextDueDate(task.dueDate, task.recurrence);
        const nextTask: Task = {
            ...task,
            id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            dueDate: nextDueDate,
            completed: false,
            completedDate: undefined,
        };
        updatedTasks = [
            ...tasks.map(t => t.id === taskId ? { ...t, completed: true, completedDate: new Date().toISOString() } : t),
            nextTask
        ];
    } else if (isRecurring && task.completed) {
        const expectedNextDueDate = calculateNextDueDate(task.dueDate, task.recurrence);
        const nextInstance = tasks.find(t => 
            t.name === task.name && 
            t.propertyId === task.propertyId &&
            t.dueDate === expectedNextDueDate &&
            !t.completed &&
            t.recurrence === task.recurrence
        );
        updatedTasks = tasks.map(t => t.id === taskId ? { ...t, completed: false, completedDate: undefined } : t);
        if (nextInstance) updatedTasks = updatedTasks.filter(t => t.id !== nextInstance.id);
    } else {
        updatedTasks = tasks.map(t => 
            t.id === taskId ? { ...t, completed: !t.completed, completedDate: !t.completed ? new Date().toISOString() : undefined } : t
        );
    }

    setTasks(updatedTasks);
    
    // Check for badges after state has been updated
    const newBadges = checkAndAwardBadges(updatedUser, updatedTasks);
    updateUser({ ...updatedUser, unlockedBadges: newBadges });
  };

  const openEditTaskModal = useCallback((task: Task) => {
    setTaskToEdit(task);
    setInitialDataForNewTask(undefined);
    setAddTaskModalOpen(true);
  }, []);

  const openAddTaskModal = useCallback(() => {
    setTaskToEdit(undefined);
    setInitialDataForNewTask(undefined);
    setAddTaskModalOpen(true);
  }, []);
  
  const openEditProviderModal = useCallback((provider: ServiceProvider) => {
    setProviderToEdit(provider);
    setProviderModalOpen(true);
  }, []);
  
  const openAddProviderModal = useCallback(() => {
    setProviderToEdit(undefined);
    setProviderModalOpen(true);
  }, []);

  const openEditInventoryItemModal = useCallback((item: InventoryItem) => {
    setInventoryItemToEdit(item);
    setInventoryModalOpen(true);
  }, []);

  const openAddInventoryItemModal = useCallback(() => {
    setInventoryItemToEdit(undefined);
    setInventoryModalOpen(true);
  }, []);

  const openEditTenantModal = useCallback((tenant: Tenant) => {
    setTenantToEdit(tenant);
    setTenantModalOpen(true);
  }, []);

  const openAddTenantModal = useCallback(() => {
    setTenantToEdit(undefined);
    setTenantModalOpen(true);
  }, []);

  const openAddPropertyModal = useCallback(() => {
    setAddPropertyModalOpen(true);
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

  // AI Recommendation Handlers
  const handleDismissRecommendation = (taskNameToDismiss: string) => {
    setRecommendations(prev => prev.filter(rec => rec.taskName !== taskNameToDismiss));
  };

  const handleAddTaskFromRecommendation = (rec: PersonalizedRecommendation) => {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30); // Default to 30 days from now

    const template: Partial<Task> = {
        name: rec.taskName,
        category: rec.category,
        priority: rec.priority,
        dueDate: dueDate.toISOString().split('T')[0],
        notes: `AI Recommendation: ${rec.reason}\nRecommended Frequency: ${rec.recommendedFrequency}.`,
    };
    setInitialDataForNewTask(template);
    setTaskToEdit(undefined);
    setAddTaskModalOpen(true);
  };

  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} onSignup={handleSignup} />;
  }

  const currentProperty = currentUser.properties.find(p => p.id === selectedPropertyId);
  const displayedTasks = tasks.filter(task => task.propertyId === selectedPropertyId);
  const displayedInventory = inventoryItems.filter(item => item.propertyId === selectedPropertyId);
  const displayedTenants = tenants.filter(tenant => tenant.propertyId === selectedPropertyId);

  return (
    <div className="flex h-screen bg-light-bg dark:bg-dark-bg text-gray-800 dark:text-dark-text font-sans">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} activeView={activeView} setActiveView={setActiveView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          user={currentUser}
          properties={currentUser.properties}
          selectedPropertyId={selectedPropertyId}
          onSelectProperty={setSelectedPropertyId}
          onLogout={handleLogout}
          onAddTaskClick={openAddTaskModal} 
          onAISuggestionsClick={() => setAISuggestionsModalOpen(true)}
          onAddPropertyClick={openAddPropertyModal}
          onMenuClick={() => setSidebarOpen(!isSidebarOpen)}
          isDarkMode={isDarkMode}
          onToggleTheme={handleToggleTheme}
          notifications={notifications}
          notificationPermission={notificationPermission as NotificationPermission}
          onMarkAllNotificationsAsRead={handleMarkAllNotificationsAsRead}
          onRequestNotificationPermission={requestNotificationPermission}
          syncStatus={syncStatus}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 lg:p-8">
          {activeView === 'dashboard' && (
            <Dashboard 
              tasks={displayedTasks} 
              serviceProviders={serviceProviders}
              tenants={displayedTenants}
              onDelete={handleDeleteTask} 
              onToggleComplete={handleToggleComplete}
              onEdit={openEditTaskModal}
              recommendations={recommendations}
              isRecsLoading={isRecsLoading}
              onDismissRecommendation={handleDismissRecommendation}
              onAddTaskFromRecommendation={handleAddTaskFromRecommendation}
              isOnline={isOnline}
              hasProperties={currentUser.properties.length > 0}
              onAddProperty={openAddPropertyModal}
            />
          )}
          {activeView === 'tenants' && (
              <Tenants
                tenants={displayedTenants}
                onAdd={openAddTenantModal}
                onEdit={openEditTenantModal}
                onDelete={handleDeleteTenant}
              />
          )}
          {activeView === 'providers' && (
              <ServiceProviders 
                providers={serviceProviders}
                onAdd={openAddProviderModal}
                onEdit={openEditProviderModal}
                onDelete={handleDeleteServiceProvider}
              />
          )}
          {activeView === 'inventory' && (
              <Inventory
                items={displayedInventory}
                onAdd={openAddInventoryItemModal}
                onEdit={openEditInventoryItemModal}
                onDelete={handleDeleteInventoryItem}
              />
          )}
          {activeView === 'reports' && (
              <Reports
                tasks={displayedTasks}
              />
          )}
          {activeView === 'awards' && (
              <Awards
                user={currentUser}
              />
          )}
        </main>
      </div>

      {isAddTaskModalOpen && (
        <AddTaskModal 
          isOpen={isAddTaskModalOpen}
          onClose={() => { setAddTaskModalOpen(false); setTaskToEdit(undefined); setInitialDataForNewTask(undefined); }}
          onAddTask={handleAddTask}
          onEditTask={handleEditTask}
          taskToEdit={taskToEdit}
          serviceProviders={serviceProviders}
          tenants={displayedTenants}
          currentUser={currentUser}
          initialData={initialDataForNewTask}
        />
      )}

      {isAISuggestionsModalOpen && (
        <AISuggestionsModal
          isOpen={isAISuggestionsModalOpen}
          onClose={() => setAISuggestionsModalOpen(false)}
          onAddTasks={addSuggestedTasks}
          isOnline={isOnline}
          currentPropertyDescription={currentProperty?.description || ''}
        />
      )}

      {isProviderModalOpen && (
        <ServiceProviderModal
          isOpen={isProviderModalOpen}
          onClose={() => { setProviderModalOpen(false); setProviderToEdit(undefined); }}
          onAdd={handleAddServiceProvider}
          onEdit={handleEditServiceProvider}
          providerToEdit={providerToEdit}
        />
      )}

      {isInventoryModalOpen && (
        <InventoryItemModal
            isOpen={isInventoryModalOpen}
            onClose={() => { setInventoryModalOpen(false); setInventoryItemToEdit(undefined); }}
            onAdd={handleAddInventoryItem}
            onEdit={handleEditInventoryItem}
            itemToEdit={inventoryItemToEdit}
        />
      )}

      {isTenantModalOpen && (
        <TenantModal
            isOpen={isTenantModalOpen}
            onClose={() => { setTenantModalOpen(false); setTenantToEdit(undefined); }}
            onAdd={handleAddTenant}
            onEdit={handleEditTenant}
            tenantToEdit={tenantToEdit}
        />
      )}

      {isAddPropertyModalOpen && (
        <AddPropertyModal
          isOpen={isAddPropertyModalOpen}
          onClose={() => setAddPropertyModalOpen(false)}
          onAddProperty={handleAddProperty}
        />
      )}

       {newlyUnlockedBadge && (
        <BadgeUnlockedToast
          badge={newlyUnlockedBadge}
          onClose={() => setNewlyUnlockedBadge(null)}
        />
      )}
    </div>
  );
};

export default App;
