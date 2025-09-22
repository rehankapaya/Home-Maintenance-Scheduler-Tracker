import React, { useState, useEffect } from 'react';
import { Tenant } from '../types';

interface TenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (tenant: Omit<Tenant, 'id' | 'propertyId'>) => void;
  onEdit: (tenant: Tenant) => void;
  tenantToEdit?: Tenant;
}

export const TenantModal: React.FC<TenantModalProps> = ({ isOpen, onClose, onAdd, onEdit, tenantToEdit }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [moveInDate, setMoveInDate] = useState('');

  useEffect(() => {
    if (tenantToEdit) {
      setName(tenantToEdit.name);
      setEmail(tenantToEdit.email || '');
      setPhone(tenantToEdit.phone || '');
      setMoveInDate(tenantToEdit.moveInDate || '');
    } else {
      setName('');
      setEmail('');
      setPhone('');
      setMoveInDate('');
    }
  }, [tenantToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const tenantData = {
      name,
      email: email || undefined,
      phone: phone || undefined,
      moveInDate: moveInDate || undefined,
    };

    if (tenantToEdit) {
      onEdit({ ...tenantToEdit, ...tenantData });
    } else {
      onAdd(tenantData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white dark:bg-dark-card rounded-lg shadow-xl w-full max-w-lg m-4 max-h-full overflow-y-auto">
        <div className="p-6 border-b dark:border-slate-700">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{tenantToEdit ? 'Edit Tenant' : 'Add New Tenant'}</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
                <label htmlFor="t-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                <input type="text" id="t-name" value={name} onChange={e => setName(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-slate-800 dark:text-white"/>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="t-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                    <input type="email" id="t-email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-slate-800 dark:text-white"/>
                </div>
                <div>
                    <label htmlFor="t-phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                    <input type="tel" id="t-phone" value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-slate-800 dark:text-white"/>
                </div>
            </div>
             <div>
                <label htmlFor="t-move-in" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Move-in Date</label>
                <input type="date" id="t-move-in" value={moveInDate} onChange={e => setMoveInDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-slate-800 dark:text-white"/>
            </div>
          </div>
          <div className="px-6 py-4 bg-gray-50 dark:bg-slate-800/50 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md hover:bg-gray-50 dark:hover:bg-slate-600">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-indigo-700">{tenantToEdit ? 'Save Changes' : 'Add Tenant'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};