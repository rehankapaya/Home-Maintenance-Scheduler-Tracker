import React from 'react';
import { InventoryItem } from '../types';
import { InventoryCard } from './InventoryCard';
import { PlusIcon } from './icons';

interface InventoryProps {
    items: InventoryItem[];
    onAdd: () => void;
    onEdit: (item: InventoryItem) => void;
    onDelete: (itemId: string) => void;
}

export const Inventory: React.FC<InventoryProps> = ({ items, onAdd, onEdit, onDelete }) => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Inventory</h1>
                <button
                    onClick={onAdd}
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                    <PlusIcon className="w-5 h-5" />
                    <span>Add Item</span>
                </button>
            </div>

            {items.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {items.map(item => (
                        <InventoryCard
                            key={item.id}
                            item={item}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 px-6 bg-white dark:bg-dark-card rounded-lg shadow-sm">
                    <p className="text-lg text-gray-500 dark:text-gray-400">Your inventory is empty.</p>
                    <p className="mt-2 text-sm text-gray-400 dark:text-gray-500">
                        Add items like appliances, tools, or paint colors to keep track of them.
                    </p>
                    <button
                        onClick={onAdd}
                        className="mt-6 flex items-center mx-auto space-x-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-indigo-700 transition-colors"
                    >
                        <PlusIcon className="w-5 h-5" />
                        <span>Add Your First Item</span>
                    </button>
                </div>
            )}
        </div>
    );
};
