import React from 'react';
import { InventoryItem } from '../types';
import { EditIcon, DeleteIcon, PaperclipIcon, BoxArchiveIcon } from './icons';

interface InventoryCardProps {
    item: InventoryItem;
    onEdit: (item: InventoryItem) => void;
    onDelete: (itemId: string) => void;
}

const getWarrantyStatus = (expiryDate?: string) => {
    if (!expiryDate) {
        return null;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(expiryDate + 'T00:00:00');

    if (expiry < today) {
        return { label: 'Expired', color: 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300' };
    }

    const thirtyDaysFromNow = new Date(today);
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    if (expiry <= thirtyDaysFromNow) {
        return { label: 'Expires Soon', color: 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300' };
    }

    return { label: 'Active', color: 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300' };
};


export const InventoryCard: React.FC<InventoryCardProps> = ({ item, onEdit, onDelete }) => {
    
    const DetailItem: React.FC<{label: string, value?: string | number}> = ({label, value}) => (
        value ? <p className="text-xs"><strong className="font-medium text-gray-600 dark:text-gray-300">{label}:</strong> {value}</p> : null
    );

    const warrantyStatus = getWarrantyStatus(item.warrantyExpiryDate);

    return (
        <div className="bg-white dark:bg-dark-card rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col">
            <div className="p-5 flex-grow">
                <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                        <BoxArchiveIcon className="w-7 h-7 text-gray-500 dark:text-gray-400" />
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{item.name}</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{item.category}</p>
                        </div>
                    </div>
                     {warrantyStatus && (
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${warrantyStatus.color}`}>
                            {warrantyStatus.label}
                        </span>
                    )}
                </div>
                
                 <div className="mt-4 space-y-1.5 text-gray-700 dark:text-gray-400">
                    <DetailItem label="Purchased" value={item.purchaseDate} />
                    <DetailItem label="Warranty Ends" value={item.warrantyExpiryDate} />
                    <DetailItem label="Model" value={item.modelNumber} />
                    <DetailItem label="Serial" value={item.serialNumber} />
                 </div>

                {item.notes && <p className="text-sm text-gray-600 dark:text-gray-300 mt-3 break-words bg-gray-50 dark:bg-slate-800/50 p-2 rounded-md">{item.notes}</p>}
            </div>

            <div className="bg-gray-50 dark:bg-slate-800/50 px-5 py-3 rounded-b-lg mt-auto">
                 <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                         {item.attachments && item.attachments.length > 0 && (
                             <div className="flex items-center space-x-1" title={`${item.attachments.length} attachments`}>
                                <PaperclipIcon className="w-5 h-5" />
                                <span className="text-xs font-bold">{item.attachments.length}</span>
                             </div>
                        )}
                    </div>
                    <div className="flex items-center space-x-2">
                        <button onClick={() => onEdit(item)} className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors" aria-label="Edit Item">
                            <EditIcon className="w-5 h-5" />
                        </button>
                        <button onClick={() => onDelete(item.id)} className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors" aria-label="Delete Item">
                            <DeleteIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};