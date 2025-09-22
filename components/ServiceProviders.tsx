import React from 'react';
import { ServiceProvider } from '../types';
import CategoryIcon, { PlusIcon, EditIcon, DeleteIcon } from './icons';

interface ServiceProvidersProps {
    providers: ServiceProvider[];
    onAdd: () => void;
    onEdit: (provider: ServiceProvider) => void;
    onDelete: (providerId: string) => void;
}

export const ServiceProviders: React.FC<ServiceProvidersProps> = ({ providers, onAdd, onEdit, onDelete }) => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Service Providers</h1>
                <button
                    onClick={onAdd}
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                    <PlusIcon className="w-5 h-5" />
                    <span>Add Provider</span>
                </button>
            </div>

            {providers.length > 0 ? (
                <div className="bg-white dark:bg-dark-card shadow-md rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                            <thead className="bg-gray-50 dark:bg-slate-800">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Specialty</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Contact</th>
                                    <th scope="col" className="relative px-6 py-3">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-dark-card divide-y divide-gray-200 dark:divide-slate-700">
                                {providers.map(provider => (
                                    <tr key={provider.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">{provider.name}</div>
                                            {provider.contactPerson && <div className="text-xs text-gray-500 dark:text-gray-400">{provider.contactPerson}</div>}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center space-x-2">
                                                <CategoryIcon category={provider.specialty} className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                                <span className="text-sm text-gray-800 dark:text-gray-200">{provider.specialty}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                            {provider.phone && <div>{provider.phone}</div>}
                                            {provider.email && <div className="text-xs">{provider.email}</div>}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end space-x-4">
                                                <button onClick={() => onEdit(provider)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300" aria-label={`Edit ${provider.name}`}>
                                                    <EditIcon className="w-5 h-5" />
                                                </button>
                                                <button onClick={() => onDelete(provider.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300" aria-label={`Delete ${provider.name}`}>
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
                    <p className="text-lg text-gray-500 dark:text-gray-400">No service providers found.</p>
                    <p className="mt-2 text-sm text-gray-400 dark:text-gray-500">
                        Add your trusted plumbers, electricians, and other professionals here.
                    </p>
                    <button
                        onClick={onAdd}
                        className="mt-6 flex items-center mx-auto space-x-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-indigo-700 transition-colors"
                    >
                        <PlusIcon className="w-5 h-5" />
                        <span>Add Your First Provider</span>
                    </button>
                </div>
            )}
        </div>
    );
};
