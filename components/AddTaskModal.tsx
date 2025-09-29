import React, { useState, useEffect, useRef } from 'react';
import { Task, Category, Priority, RecurrenceRule, ServiceProvider, Attachment, Tenant, User, UserRole } from '../types';
import { CATEGORY_OPTIONS, PRIORITY_OPTIONS, RECURRENCE_OPTIONS } from '../constants';
import { PaperclipIcon, DeleteIcon } from './icons';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: Omit<Task, 'id' | 'propertyId' | 'completed' | 'completedDate'>) => void;
  onEditTask: (task: Task) => void;
  taskToEdit?: Task;
  serviceProviders: ServiceProvider[];
  tenants: Tenant[];
  currentUser: User;
  initialData?: Partial<Task>;
}

const today = new Date().toISOString().split('T')[0];

export const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose, onAddTask, onEditTask, taskToEdit, serviceProviders, tenants, currentUser, initialData }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>(Category.General);
  const [priority, setPriority] = useState<Priority>(Priority.Medium);
  const [dueDate, setDueDate] = useState(today);
  const [notes, setNotes] = useState('');
  const [recurrence, setRecurrence] = useState<RecurrenceRule>(RecurrenceRule.None);
  const [serviceProviderId, setServiceProviderId] = useState<string>('');
  const [tenantId, setTenantId] = useState<string>('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [cost, setCost] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (taskToEdit) {
      setName(taskToEdit.name);
      setCategory(taskToEdit.category);
      setPriority(taskToEdit.priority);
      setDueDate(taskToEdit.dueDate);
      setNotes(taskToEdit.notes || '');
      setRecurrence(taskToEdit.recurrence || RecurrenceRule.None);
      setServiceProviderId(taskToEdit.serviceProviderId || '');
      setTenantId(taskToEdit.tenantId || '');
      setAttachments(taskToEdit.attachments || []);
      setCost(taskToEdit.cost?.toString() || '');
    } else if (initialData) {
        setName(initialData.name || '');
        setCategory(initialData.category || Category.General);
        setPriority(initialData.priority || Priority.Medium);
        setDueDate(initialData.dueDate || today);
        setNotes(initialData.notes || '');
        setRecurrence(initialData.recurrence || RecurrenceRule.None);
        setServiceProviderId(initialData.serviceProviderId || '');
        setTenantId(initialData.tenantId || '');
        setAttachments(initialData.attachments || []);
        setCost(initialData.cost?.toString() || '');
    } else {
      // Reset form for new task
      setName('');
      setCategory(Category.General);
      setPriority(Priority.Medium);
      setDueDate(today);
      setNotes('');
      setRecurrence(RecurrenceRule.None);
      setServiceProviderId('');
      setTenantId('');
      setAttachments([]);
      setCost('');
    }
  }, [taskToEdit, initialData, isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
        const newAttachments: Attachment[] = Array.from(e.target.files).map((file: File) => ({
            id: `att-${Date.now()}-${Math.random()}`,
            fileName: file.name,
            fileType: file.type,
            url: URL.createObjectURL(file) // For preview, in real app this would be an upload process
        }));
        setAttachments(prev => [...prev, ...newAttachments]);
    }
  };
  
  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const taskData = {
        name,
        category,
        priority,
        dueDate,
        notes,
        cost: cost ? parseFloat(cost) : undefined,
        recurrence,
        serviceProviderId: serviceProviderId || undefined,
        tenantId: tenantId || undefined,
        attachments,
    };

    if (taskToEdit) {
      onEditTask({ ...taskToEdit, ...taskData });
    } else {
      onAddTask(taskData);
    }
  };

  const isPropertyManager = currentUser.role === UserRole.PropertyManager;

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Due Date</label>
                    <input type="date" id="dueDate" value={dueDate} min={today} onChange={e => setDueDate(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-slate-800 dark:text-white"/>
                </div>
                 <div>
                    <label htmlFor="recurrence" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Recurrence</label>
                    <select id="recurrence" value={recurrence} onChange={e => setRecurrence(e.target.value as RecurrenceRule)} className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-slate-800 dark:text-white">
                    {RECURRENCE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="serviceProvider" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Service Provider</label>
                    <select id="serviceProvider" value={serviceProviderId} onChange={e => setServiceProviderId(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-slate-800 dark:text-white">
                        <option value="">None</option>
                        {serviceProviders.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                </div>
                 <div>
                    <label htmlFor="cost" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cost (Optional)</label>
                    <input type="number" id="cost" value={cost} onChange={e => setCost(e.target.value)} placeholder="e.g., 150.00" step="0.01" className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-slate-800 dark:text-white"/>
                </div>
            </div>
            {isPropertyManager && (
                 <div>
                    <label htmlFor="tenant" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Assign to Tenant</label>
                    <select id="tenant" value={tenantId} onChange={e => setTenantId(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-slate-800 dark:text-white">
                        <option value="">Unassigned</option>
                        {tenants.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                </div>
            )}
            <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
                <textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-slate-800 dark:text-white"></textarea>
            </div>
             <div>
                <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Attachments</span>
                 <div className="space-y-2">
                     {attachments.map(att => (
                         <div key={att.id} className="flex items-center justify-between p-2 bg-gray-100 dark:bg-slate-700 rounded-md">
                             <div className="flex items-center space-x-2 overflow-hidden">
                                 <PaperclipIcon className="w-4 h-4 text-gray-500 flex-shrink-0"/>
                                 <span className="text-sm text-gray-800 dark:text-gray-200 truncate" title={att.fileName}>{att.fileName}</span>
                             </div>
                             <button type="button" onClick={() => removeAttachment(att.id)} className="text-red-500 hover:text-red-700 dark:hover:text-red-400">
                                 <DeleteIcon className="w-4 h-4"/>
                             </button>
                         </div>
                     ))}
                 </div>
                 <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple className="hidden"/>
                 <button type="button" onClick={() => fileInputRef.current?.click()} className="mt-2 text-sm font-medium text-primary hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
                     + Add Files
                 </button>
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
