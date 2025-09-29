import React, { useState, useEffect, useRef } from 'react';
import { InventoryItem, InventoryCategory, Attachment } from '../types';
import { INVENTORY_CATEGORY_OPTIONS } from '../constants';
import { PaperclipIcon, DeleteIcon } from './icons';

interface InventoryItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: Omit<InventoryItem, 'id' | 'propertyId'>) => void;
  onEdit: (item: InventoryItem) => void;
  itemToEdit?: InventoryItem;
}

export const InventoryItemModal: React.FC<InventoryItemModalProps> = ({ isOpen, onClose, onAdd, onEdit, itemToEdit }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<InventoryCategory>(InventoryCategory.Other);
  const [purchaseDate, setPurchaseDate] = useState('');
  const [warrantyExpiryDate, setWarrantyExpiryDate] = useState('');
  const [price, setPrice] = useState('');
  const [modelNumber, setModelNumber] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (itemToEdit) {
      setName(itemToEdit.name);
      setCategory(itemToEdit.category);
      setPurchaseDate(itemToEdit.purchaseDate || '');
      setWarrantyExpiryDate(itemToEdit.warrantyExpiryDate || '');
      setPrice(itemToEdit.price?.toString() || '');
      setModelNumber(itemToEdit.modelNumber || '');
      setSerialNumber(itemToEdit.serialNumber || '');
      setNotes(itemToEdit.notes || '');
      setAttachments(itemToEdit.attachments || []);
    } else {
      setName('');
      setCategory(InventoryCategory.Other);
      setPurchaseDate('');
      setWarrantyExpiryDate('');
      setPrice('');
      setModelNumber('');
      setSerialNumber('');
      setNotes('');
      setAttachments([]);
    }
  }, [itemToEdit, isOpen]);

  if (!isOpen) return null;
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
        const newAttachments: Attachment[] = Array.from(e.target.files).map((file: File) => ({
            id: `att-${Date.now()}-${Math.random()}`,
            fileName: file.name,
            fileType: file.type,
            url: URL.createObjectURL(file)
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

    const itemData = {
      name,
      category,
      purchaseDate: purchaseDate || undefined,
      warrantyExpiryDate: warrantyExpiryDate || undefined,
      price: price ? parseFloat(price) : undefined,
      modelNumber: modelNumber || undefined,
      serialNumber: serialNumber || undefined,
      notes: notes || undefined,
      attachments,
    };

    if (itemToEdit) {
      onEdit({ ...itemToEdit, ...itemData });
    } else {
      onAdd(itemData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white dark:bg-dark-card rounded-lg shadow-xl w-full max-w-lg m-4 max-h-full overflow-y-auto">
        <div className="p-6 border-b dark:border-slate-700">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{itemToEdit ? 'Edit Item' : 'Add New Item'}</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Item Name</label>
                    <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm dark:bg-slate-800 dark:text-white"/>
                </div>
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                    <select id="category" value={category} onChange={e => setCategory(e.target.value as InventoryCategory)} className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm dark:bg-slate-800 dark:text-white">
                    {INVENTORY_CATEGORY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="purchaseDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Purchase Date</label>
                    <input type="date" id="purchaseDate" value={purchaseDate} onChange={e => setPurchaseDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm dark:bg-slate-800 dark:text-white"/>
                </div>
                <div>
                    <label htmlFor="warrantyExpiryDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Warranty Expiry</label>
                    <input type="date" id="warrantyExpiryDate" value={warrantyExpiryDate} onChange={e => setWarrantyExpiryDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm dark:bg-slate-800 dark:text-white"/>
                </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price</label>
                    <input type="number" id="price" value={price} onChange={e => setPrice(e.target.value)} placeholder="e.g., 499.99" className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm dark:bg-slate-800 dark:text-white"/>
                </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label htmlFor="model" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Model #</label>
                    <input type="text" id="model" value={modelNumber} onChange={e => setModelNumber(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm dark:bg-slate-800 dark:text-white"/>
                </div>
                <div>
                    <label htmlFor="serial" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Serial #</label>
                    <input type="text" id="serial" value={serialNumber} onChange={e => setSerialNumber(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm dark:bg-slate-800 dark:text-white"/>
                </div>
            </div>
            <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
                <textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm dark:bg-slate-800 dark:text-white"></textarea>
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
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-indigo-700">{itemToEdit ? 'Save Changes' : 'Add Item'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};
