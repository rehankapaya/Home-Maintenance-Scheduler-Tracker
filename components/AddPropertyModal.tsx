import React, { useState, useEffect } from 'react';
import { Property } from '../types';

interface AddPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProperty: (property: Omit<Property, 'id'>) => void;
}

export const AddPropertyModal: React.FC<AddPropertyModalProps> = ({ isOpen, onClose, onAddProperty }) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (isOpen) {
        setName('');
        setAddress('');
        setDescription('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !address.trim()) return;

    onAddProperty({
      name,
      address,
      description,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white dark:bg-dark-card rounded-lg shadow-xl w-full max-w-lg m-4 max-h-full overflow-y-auto">
        <div className="p-6 border-b dark:border-slate-700">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Add New Property</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="prop-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Property Name</label>
              <input type="text" id="prop-name" value={name} onChange={e => setName(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-slate-800 dark:text-white" placeholder="e.g., Main Street Home" />
            </div>
            <div>
              <label htmlFor="prop-address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
              <input type="text" id="prop-address" value={address} onChange={e => setAddress(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-slate-800 dark:text-white" placeholder="e.g., 123 Main St, Anytown, USA" />
            </div>
            <div>
              <label htmlFor="prop-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Property Description</label>
              <textarea id="prop-description" value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-slate-800 dark:text-white" placeholder="e.g., A 3-bedroom, 2-bathroom house..."></textarea>
            </div>
          </div>
          <div className="px-6 py-4 bg-gray-50 dark:bg-slate-800/50 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md hover:bg-gray-50 dark:hover:bg-slate-600">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-indigo-700">Add Property</button>
          </div>
        </form>
      </div>
    </div>
  );
};
