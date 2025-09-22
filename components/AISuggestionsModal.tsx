import React, { useState, useEffect } from 'react';
import { generateMaintenanceTasks } from '../services/geminiService';
import { SuggestedTask, Task } from '../types';
import CategoryIcon, { UserIcon } from './icons';

interface AISuggestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTasks: (tasks: Omit<Task, 'id' | 'completed' | 'propertyId' | 'completedDate'>[]) => void;
  isOnline: boolean;
}

export const AISuggestionsModal: React.FC<AISuggestionsModalProps> = ({ isOpen, onClose, onAddTasks, isOnline }) => {
  const [homeDescription, setHomeDescription] = useState('A 3-bedroom, 2-bathroom house in a temperate climate with a small yard.');
  const [suggestions, setSuggestions] = useState<SuggestedTask[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!homeDescription.trim() || !isOnline) return;
    setIsLoading(true);
    setError(null);
    setSuggestions([]);
    setSelectedTasks([]);

    try {
      const result = await generateMaintenanceTasks(homeDescription);
      setSuggestions(result);
    } catch (err) {
      setError('Failed to generate suggestions. Please check your API key and try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && suggestions.length === 0 && !isLoading && !error && isOnline) {
      handleGenerate();
    }
  }, [isOpen, isOnline]);
  
  const handleToggleSelection = (index: number) => {
    setSelectedTasks(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const handleAddSelectedTasks = () => {
    const today = new Date();
    const tasksToAdd = selectedTasks.map(index => {
        const suggestion = suggestions[index];
        const dueDate = new Date(today);
        
        if (suggestion.recommendedFrequency.toLowerCase().includes('month')) {
            dueDate.setMonth(dueDate.getMonth() + 1);
        } else if (suggestion.recommendedFrequency.toLowerCase().includes('quarter')) {
            dueDate.setMonth(dueDate.getMonth() + 3);
        } else if (suggestion.recommendedFrequency.toLowerCase().includes('year')) {
            dueDate.setFullYear(dueDate.getFullYear() + 1);
        } else {
             dueDate.setDate(dueDate.getDate() + 7);
        }

        let notes = `Suggested based on AI. Recommended frequency: ${suggestion.recommendedFrequency}`;
        if (suggestion.recommendedProfessional) {
            notes += `\nAI Suggestion: A professional ${suggestion.recommendedProfessional} may be required.`;
        }

        return {
            name: suggestion.taskName,
            category: suggestion.category,
            priority: suggestion.priority,
            dueDate: dueDate.toISOString().split('T')[0],
            notes: notes,
        };
    });
    onAddTasks(tasksToAdd);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-dark-card rounded-lg shadow-xl w-full max-w-2xl max-h-full flex flex-col">
        <div className="p-6 border-b dark:border-slate-700">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">AI Maintenance Suggestions</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Describe your home, and we'll suggest a personalized maintenance schedule.</p>
        </div>
        
        <div className="p-6 flex-grow overflow-y-auto space-y-4">
            <div>
              <label htmlFor="homeDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Home Description</label>
              <textarea
                id="homeDescription"
                value={homeDescription}
                onChange={(e) => setHomeDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-slate-800 dark:text-white"
                placeholder="e.g., A 2-story house in a snowy region with a wooden deck and a gas furnace."
              />
            </div>
            
            {isLoading && (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Generating suggestions...</p>
              </div>
            )}
            
            {error && <div className="p-3 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded-md text-sm">{error}</div>}
            
            {suggestions.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold dark:text-white">Suggested Tasks:</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Here are some suggestions tailored for the current season.</p>
                <ul className="border dark:border-slate-700 rounded-md divide-y dark:divide-slate-700">
                  {suggestions.map((task, index) => (
                    <li key={index} className={`p-3 flex items-start space-x-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700/50 ${selectedTasks.includes(index) ? 'bg-indigo-50 dark:bg-indigo-900/30' : ''}`} onClick={() => handleToggleSelection(index)}>
                      <input type="checkbox" checked={selectedTasks.includes(index)} readOnly className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary mt-1 flex-shrink-0"/>
                      <CategoryIcon category={task.category} className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-1 flex-shrink-0"/>
                      <div className="flex-1">
                          <p className="font-medium text-gray-800 dark:text-gray-200">{task.taskName}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{task.recommendedFrequency} &bull; {task.priority}</p>
                          {task.recommendedProfessional && (
                              <div className="flex items-center space-x-1.5 text-xs text-blue-600 dark:text-blue-400 mt-1">
                                  <UserIcon className="w-3 h-3" />
                                  <span>{task.recommendedProfessional} Recommended</span>
                              </div>
                          )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
        </div>
        
        <div className="px-6 py-4 bg-gray-50 dark:bg-slate-800/50 flex justify-between items-center">
          <div className="flex-1">
            {!isOnline && suggestions.length === 0 && (
              <p className="text-xs text-red-600 dark:text-red-400">Internet connection required to generate suggestions.</p>
            )}
            {suggestions.length > 0 && <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{selectedTasks.length} task(s) selected</span>}
          </div>
          <div className="flex space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md hover:bg-gray-50 dark:hover:bg-slate-600">Cancel</button>
            {suggestions.length === 0 ? (
                <button onClick={handleGenerate} disabled={isLoading || !isOnline} className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-indigo-700 disabled:bg-indigo-300 dark:disabled:bg-indigo-800 disabled:cursor-not-allowed">
                    {isLoading ? 'Generating...' : 'Generate'}
                </button>
            ) : (
                <button onClick={handleAddSelectedTasks} disabled={selectedTasks.length === 0} className="px-4 py-2 text-sm font-medium text-white bg-secondary rounded-md hover:bg-emerald-600 disabled:bg-emerald-300 dark:disabled:bg-emerald-800">Add Selected</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};