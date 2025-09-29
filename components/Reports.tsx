import React, { useState, useMemo } from 'react';
import { Task, Category, Priority } from '../types';
import { CurrencyDollarIcon, PrinterIcon } from './icons';

interface ReportsProps {
    tasks: Task[];
}

type DatePreset = 'week' | 'month' | 'year';

const getPresetDates = (preset: DatePreset): [Date, Date] => {
    const end = new Date();
    const start = new Date();
    end.setHours(23, 59, 59, 999);
    start.setHours(0, 0, 0, 0);

    switch (preset) {
        case 'week':
            start.setDate(start.getDate() - start.getDay()); // Start of week (Sunday)
            break;
        case 'month':
            start.setDate(1); // Start of month
            break;
        case 'year':
            start.setMonth(0, 1); // Start of year
            break;
    }
    return [start, end];
}

const BarChart: React.FC<{ data: { label: string, value: number, color: string }[], title: string, formatAsCurrency?: boolean }> = ({ data, title, formatAsCurrency = false }) => {
    const maxValue = useMemo(() => Math.max(...data.map(d => d.value), 1), [data]);
    
    const formatValue = (value: number) => {
        if (formatAsCurrency) {
            return `$${value.toFixed(2)}`;
        }
        return value;
    };

    return (
        <div className="p-4 bg-white dark:bg-dark-card rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">{title}</h3>
            <div className="space-y-2">
                {data.map(({ label, value, color }) => (
                    <div key={label} className="grid grid-cols-4 items-center gap-2">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300 col-span-1 truncate">{label}</span>
                        <div className="col-span-3 flex items-center space-x-2">
                            <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-4">
                                <div
                                    className={`${color} h-4 rounded-full`}
                                    style={{ width: `${(value / maxValue) * 100}%` }}
                                ></div>
                            </div>
                            <span className="text-sm font-bold text-gray-800 dark:text-white">{formatValue(value)}</span>
                        </div>
                    </div>
                ))}
                 {data.length === 0 && <p className="text-sm text-gray-500 dark:text-gray-400">No data for this period.</p>}
            </div>
        </div>
    );
};


export const Reports: React.FC<ReportsProps> = ({ tasks }) => {
    const [preset, setPreset] = useState<DatePreset>('month');
    
    const [startDate, endDate] = useMemo(() => getPresetDates(preset), [preset]);

    const completedTasksInRange = useMemo(() => {
        return tasks.filter(task =>
            task.completed &&
            task.completedDate &&
            new Date(task.completedDate) >= startDate &&
            new Date(task.completedDate) <= endDate
        );
    }, [tasks, startDate, endDate]);

    const totalCompleted = completedTasksInRange.length;
    
    const totalCost = useMemo(() => {
        return completedTasksInRange.reduce((sum, task) => sum + (task.cost || 0), 0);
    }, [completedTasksInRange]);


    const byCategory = useMemo(() => {
        const counts = completedTasksInRange.reduce((acc, task) => {
            acc[task.category] = (acc[task.category] || 0) + 1;
            return acc;
        }, {} as Record<Category, number>);
        return Object.entries(counts).map(([label, value]) => ({ label, value })).sort((a,b) => (b.value as number) - (a.value as number));
    }, [completedTasksInRange]);
    
    const byPriority = useMemo(() => {
        const counts = completedTasksInRange.reduce((acc, task) => {
            acc[task.priority] = (acc[task.priority] || 0) + 1;
            return acc;
        }, {} as Record<Priority, number>);
        
        const priorityOrder: Priority[] = [Priority.Urgent, Priority.Medium, Priority.Low];
        return priorityOrder.map(p => ({
            label: p,
            value: counts[p] || 0,
            color: p === Priority.Urgent ? 'bg-red-500' : p === Priority.Medium ? 'bg-yellow-500' : 'bg-green-500'
        }));

    }, [completedTasksInRange]);
    
    const costByCategory = useMemo(() => {
        const costs = completedTasksInRange.reduce((acc, task) => {
            if (task.cost && task.cost > 0) {
                acc[task.category] = (acc[task.category] || 0) + task.cost;
            }
            return acc;
        }, {} as Record<Category, number>);
        return Object.entries(costs).map(([label, value]) => ({ label, value })).sort((a,b) => (b.value as number) - (a.value as number));
    }, [completedTasksInRange]);

    
    const categoryColors = ['bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 'bg-pink-500', 'bg-teal-500', 'bg-cyan-500', 'bg-orange-500'];
    const categoryChartData = byCategory.map((item, index) => ({
        ...item,
        color: categoryColors[index % categoryColors.length]
    }));
    const costByCategoryChartData = costByCategory.map((item, index) => ({
        ...item,
        color: categoryColors[index % categoryColors.length]
    }));

    return (
        <div className="space-y-6" id="reports-page">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Reports</h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        Summary of completed tasks from {startDate.toLocaleDateString()} to {endDate.toLocaleDateString()}
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                     <div className="flex space-x-1 bg-gray-200 dark:bg-slate-700 p-1 rounded-md">
                        {(['week', 'month', 'year'] as DatePreset[]).map(p => (
                            <button 
                                key={p}
                                onClick={() => setPreset(p)}
                                className={`px-3 py-1 text-sm font-medium rounded capitalize ${preset === p ? 'bg-white dark:bg-slate-900 text-primary shadow' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600'}`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => window.print()}
                        className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-white bg-primary rounded-md hover:bg-indigo-700 transition-colors"
                    >
                        <PrinterIcon className="w-4 h-4" />
                        <span>Print</span>
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-sm">
                 <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Maintenance Summary</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="text-center p-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg">
                        <p className="text-4xl font-extrabold text-primary">{totalCompleted}</p>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Tasks Completed</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg">
                        <p className="text-4xl font-extrabold text-secondary">${totalCost.toFixed(2)}</p>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Costs</p>
                    </div>
                    <div className="p-4">
                        <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Tasks by Category</h3>
                        <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                            {byCategory.length > 0 ? byCategory.map(c => (
                                <li key={c.label} className="flex justify-between"><span>{c.label}</span> <strong>{c.value}</strong></li>
                            )) : <li>No tasks.</li>}
                        </ul>
                    </div>
                     <div className="p-4">
                        <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Tasks by Priority</h3>
                        <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                             {byPriority.map(p => (
                                <li key={p.label} className="flex justify-between"><span>{p.label}</span> <strong>{p.value}</strong></li>
                            ))}
                        </ul>
                    </div>
                 </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <BarChart data={categoryChartData} title="Completed Tasks by Category" />
                <BarChart data={byPriority} title="Completed Tasks by Priority" />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <BarChart data={costByCategoryChartData} title="Spending by Category" formatAsCurrency={true} />
            </div>

        </div>
    );
};
