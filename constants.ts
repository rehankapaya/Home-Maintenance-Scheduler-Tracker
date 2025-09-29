

import { Task, Category, Priority, User, UserRole, Property, RecurrenceRule, ServiceProvider, InventoryItem, InventoryCategory, Attachment, Tenant, Badge } from './types';

export const ALL_BADGES: Badge[] = [
    { id: 'badge-1', name: 'First Task Complete', description: 'You completed your very first task. Keep it up!', icon: 'Sparkles' },
    { id: 'badge-2', name: 'On-Time Pro', description: 'Complete 5 tasks on or before their due date.', icon: 'CalendarDays' },
    { id: 'badge-3', name: 'Task Master', description: 'Complete 15 tasks.', icon: 'CheckBadge' },
    { id: 'badge-4', name: 'Maintenance Champion', description: 'Reach 500 points.', icon: 'Trophy' },
];

export const MOCK_USER: User = {
  id: 'user-1',
  name: 'Alex Doe',
  email: 'alex.doe@example.com',
  password: 'password123',
  role: UserRole.PropertyManager,
  properties: [
    { id: 'prop-1', name: 'Main Street Home', address: '123 Main St, Anytown, USA', description: 'A 3-bedroom, 2-bathroom house in a temperate climate with a small yard. Located in a suburban area.' },
    { id: 'prop-2', name: 'Lakeside Cabin', address: '456 Lake Rd, Lakeside, USA', description: 'A 2-bedroom rustic cabin with a wooden deck, located in a coastal region with heavy snowfall in winter.' },
  ],
  points: 0,
  unlockedBadges: [],
};

export const MOCK_TENANTS: Tenant[] = [
    { id: 't-1', propertyId: 'prop-1', name: 'John Smith', email: 'john.s@example.com', phone: '555-111-2222', moveInDate: '2023-01-15' },
    { id: 't-2', propertyId: 'prop-1', name: 'Sarah Connor', email: 'sarah.c@example.com', phone: '555-333-4444' },
    { id: 't-3', propertyId: 'prop-2', name: 'Kyle Reese', email: 'kyle.r@example.com', phone: '555-555-6666', moveInDate: '2024-03-01' },
];

export const MOCK_SERVICE_PROVIDERS: ServiceProvider[] = [
    { id: 'sp-1', name: 'A+ Plumbing', specialty: Category.Plumbing, phone: '555-123-4567', email: 'contact@aplusplumbing.com' },
    { id: 'sp-2', name: 'Electric Eagles', specialty: Category.Electrical, contactPerson: 'Jane Smith', phone: '555-765-4321' },
    { id: 'sp-3', name: 'CoolBreeze HVAC', specialty: Category.HVAC, phone: '555-987-6543', email: 'service@coolbreeze.com' },
];

export const MOCK_INVENTORY_ITEMS: InventoryItem[] = [
    {
        id: 'inv-1',
        propertyId: 'prop-1',
        name: 'LG Refrigerator LFXS26973S',
        category: InventoryCategory.Appliance,
        purchaseDate: '2022-08-15',
        price: 1800,
        warrantyExpiryDate: '2024-08-15',
        modelNumber: 'LFXS26973S',
        serialNumber: 'LG12345ABC',
        attachments: [
            { id: 'att-1', fileName: 'fridge-receipt.pdf', fileType: 'application/pdf', url: '#' },
            { id: 'att-2', fileName: 'user-manual.pdf', fileType: 'application/pdf', url: '#' },
        ]
    },
    {
        id: 'inv-2',
        propertyId: 'prop-1',
        name: 'DeWalt 20V MAX Cordless Drill',
        category: InventoryCategory.Tools,
        purchaseDate: '2021-05-20',
        price: 150,
    },
    {
        id: 'inv-3',
        propertyId: 'prop-2',
        name: 'Sherwin-Williams Interior Paint',
        category: InventoryCategory.Paint,
        notes: 'Color: Agreeable Gray (SW 7029), Finish: Eggshell. Used in living room.',
    }
];


export const INITIAL_TASKS: Task[] = [
  {
    id: '1',
    propertyId: 'prop-1',
    name: 'Clean Gutters',
    category: Category.Seasonal,
    priority: Priority.Medium,
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    completed: false,
    notes: 'Remove leaves and debris from all gutters and downspouts.',
    recurrence: RecurrenceRule.Yearly,
  },
  {
    id: '2',
    propertyId: 'prop-1',
    name: 'Test Smoke Detectors',
    category: Category.Electrical,
    priority: Priority.Urgent,
    dueDate: new Date().toISOString().split('T')[0],
    completed: false,
    notes: 'Check batteries and functionality of all smoke and CO detectors.',
    recurrence: RecurrenceRule.Monthly,
    serviceProviderId: 'sp-2',
    tenantId: 't-1',
  },
  {
    id: '3',
    propertyId: 'prop-1',
    name: 'Service HVAC System',
    category: Category.HVAC,
    priority: Priority.Medium,
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    completed: false,
    recurrence: RecurrenceRule.Yearly,
    serviceProviderId: 'sp-3',
    attachments: [
        { id: 'att-3', fileName: 'hvac-service-quote.pdf', fileType: 'application/pdf', url: '#' }
    ]
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
    notes: 'Inspect under sinks and around toilets for any signs of water damage.',
    serviceProviderId: 'sp-1',
    tenantId: 't-3',
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
    notes: 'For the Lakeside Cabin before winter.',
    serviceProviderId: 'sp-1'
  }
];

export const CATEGORY_OPTIONS = Object.values(Category);
export const INVENTORY_CATEGORY_OPTIONS = Object.values(InventoryCategory);
export const PRIORITY_OPTIONS = Object.values(Priority);
export const RECURRENCE_OPTIONS = Object.values(RecurrenceRule);