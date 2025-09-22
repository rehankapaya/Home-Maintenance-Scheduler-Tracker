import React from 'react';
import { Tenant } from '../types';
import { PlusIcon, EditIcon, DeleteIcon, UserIcon } from './icons';

interface TenantsProps {
    tenants: Tenant[];
    onAdd: () => void;
    onEdit: (tenant: Tenant) => void;
    onDelete: (tenantId: string) => void;
}

export const Tenants: React.FC<TenantsProps> = ({ tenants, onAdd, onEdit, onDelete }) => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Tenants</h1>
                <button
                    onClick={onAdd}
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                    <PlusIcon className="w-5 h-5" />
                    <span>Add Tenant</span>
                </button>
            </div>

            {tenants.length > 0 ? (
                <div className="bg-white dark:bg-dark-card shadow-md rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                            <thead className="bg-gray-50 dark:bg-slate-800">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Contact</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Move-in Date</th>
                                    <th scope="col" className="relative px-6 py-3">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-dark-card divide-y divide-gray-200 dark:divide-slate-700">
                                {tenants.map(tenant => (
                                    <tr key={tenant.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">{tenant.name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                            {tenant.phone && <div>{tenant.phone}</div>}
                                            {tenant.email && <div className="text-xs">{tenant.email}</div>}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                            {tenant.moveInDate ? new Date(tenant.moveInDate + 'T00:00:00').toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end space-x-4">
                                                <button onClick={() => onEdit(tenant)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300" aria-label={`Edit ${tenant.name}`}>
                                                    <EditIcon className="w-5 h-5" />
                                                </button>
                                                <button onClick={() => onDelete(tenant.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300" aria-label={`Delete ${tenant.name}`}>
                                                    <DeleteIcon className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="text-center py-16 px-6 bg-white dark:bg-dark-card rounded-lg shadow-sm">
                    <UserIcon className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600" />
                    <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">No tenants found for this property.</p>
                    <p className="mt-2 text-sm text-gray-400 dark:text-gray-500">
                        Add tenants to assign them tasks and manage your property.
                    </p>
                    <button
                        onClick={onAdd}
                        className="mt-6 flex items-center mx-auto space-x-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-indigo-700 transition-colors"
                    >
                        <PlusIcon className="w-5 h-5" />
                        <span>Add Your First Tenant</span>
                    </button>
                </div>
            )}
        </div>
    );
};
