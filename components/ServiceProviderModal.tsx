import React, { useState, useEffect } from 'react';
import { ServiceProvider, Category } from '../types';
import { CATEGORY_OPTIONS } from '../constants';

interface ServiceProviderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (provider: Omit<ServiceProvider, 'id'>) => void;
  onEdit: (provider: ServiceProvider) => void;
  providerToEdit?: ServiceProvider;
}

export const ServiceProviderModal: React.FC<ServiceProviderModalProps> = ({ isOpen, onClose, onAdd, onEdit, providerToEdit }) => {
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState<Category | 'General Contractor'>(Category.General);
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (providerToEdit) {
      setName(providerToEdit.name);
      setSpecialty(providerToEdit.specialty);
      setContactPerson(providerToEdit.contactPerson || '');
      setPhone(providerToEdit.phone || '');
      setEmail(providerToEdit.email || '');
    } else {
      setName('');
      setSpecialty(Category.General);
      setContactPerson('');
      setPhone('');
      setEmail('');
    }
  }, [providerToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const providerData = {
      name,
      specialty,
      contactPerson: contactPerson || undefined,
      phone: phone || undefined,
      email: email || undefined,
    };

    if (providerToEdit) {
      onEdit({ ...providerToEdit, ...providerData });
    } else {
      onAdd(providerData);
    }
  };
  
  const allSpecialties: (Category | 'General Contractor')[] = [...CATEGORY_OPTIONS, 'General Contractor'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white dark:bg-dark-card rounded-lg shadow-xl w-full max-w-lg m-4 max-h-full overflow-y-auto">
        <div className="p-6 border-b dark:border-slate-700">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{providerToEdit ? 'Edit Service Provider' : 'Add New Provider'}</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="sp-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Provider Name</label>
                    <input type="text" id="sp-name" value={name} onChange={e => setName(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-slate-800 dark:text-white"/>
                </div>
                 <div>
                    <label htmlFor="sp-specialty" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Specialty</label>
                    <select id="sp-specialty" value={specialty} onChange={e => setSpecialty(e.target.value as Category)} className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-slate-800 dark:text-white">
                    {allSpecialties.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label htmlFor="sp-contact" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contact Person</label>
                    <input type="text" id="sp-contact" value={contactPerson} onChange={e => setContactPerson(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-slate-800 dark:text-white"/>
                </div>
                <div>
                    <label htmlFor="sp-phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                    <input type="tel" id="sp-phone" value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-slate-800 dark:text-white"/>
                </div>
            </div>
            <div>
                <label htmlFor="sp-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                <input type="email" id="sp-email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-slate-800 dark:text-white"/>
            </div>
          </div>
          <div className="px-6 py-4 bg-gray-50 dark:bg-slate-800/50 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md hover:bg-gray-50 dark:hover:bg-slate-600">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-indigo-700">{providerToEdit ? 'Save Changes' : 'Add Provider'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};
