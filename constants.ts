
import { Task, Category, Priority, User, UserRole, Property } from './types';

export const MOCK_USER: User = {
  id: 'user-1',
  name: 'Alex Doe',
  email: 'alex.doe@example.com',
  role: UserRole.Homeowner,
  properties: [
    { id: 'prop-1', name: 'Main Street Home', address: '123 Main St, Anytown, USA' },
    { id: 'prop-2', name: 'Lakeside Cabin', address: '456 Lake Rd, Lakeside, USA' },
  ],
};


export const INITIAL_TASKS: Task[] = [
  {
    id: '1',
    propertyId: 'prop-1',
    name: 'Clean Gutters',
    category: Category.Seasonal,
    priority: Priority.Medium,
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    completed: false,
    notes: 'Remove leaves and debris from all gutters and downspouts.'
  },
  {
    id: '2',
    propertyId: 'prop-1',
    name: 'Test Smoke Detectors',
    category: Category.Electrical,
    priority: Priority.Urgent,
    dueDate: new Date().toISOString().split('T')[0],
    completed: false,
    notes: 'Check batteries and functionality of all smoke and CO detectors.'
  },
  {
    id: '3',
    propertyId: 'prop-1',
    name: 'Service HVAC System',
    category: Category.Appliance,
    priority: Priority.Medium,
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    completed: false,
  },
    {
    id: '4',
    propertyId: 'prop-2',
    name: 'Deep Clean Kitchen',
    category: Category.Cleaning,
    priority: Priority.Low,
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    completed: false,
    notes: 'Clean inside of oven, microwave, and refrigerator.'
  },
  {
    id: '5',
    propertyId: 'prop-2',
    name: 'Check for Leaks',
    category: Category.Plumbing,
    priority: Priority.Urgent,
    dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    completed: false,
    notes: 'Inspect under sinks and around toilets for any signs of water damage.'
  },
  {
    id: '6',
    propertyId: 'prop-1',
    name: 'Power Wash Driveway',
    category: Category.Seasonal,
    priority: Priority.Low,
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    completed: true,
    completedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '7',
    propertyId: 'prop-2',
    name: 'Winterize Pipes',
    category: Category.Plumbing,
    priority: Priority.Medium,
    dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    completed: false,
    notes: 'For the Lakeside Cabin before winter.'
  }
];

export const CATEGORY_OPTIONS = Object.values(Category);
export const PRIORITY_OPTIONS = Object.values(Priority);
