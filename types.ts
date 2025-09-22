
export enum Priority {
  Urgent = 'Urgent',
  Medium = 'Medium',
  Low = 'Low',
}

export enum Category {
  Plumbing = 'Plumbing',
  Electrical = 'Electrical',
  Cleaning = 'Cleaning',
  Appliance = 'Appliance',
  Seasonal = 'Seasonal',
  General = 'General',
}

export enum UserRole {
  Homeowner = 'Homeowner',
  Tenant = 'Tenant',
  PropertyManager = 'Property Manager',
}

export interface Property {
  id: string;
  name: string;
  address: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  properties: Property[];
}

export interface Task {
  id: string;
  propertyId: string;
  name: string;
  category: Category;
  priority: Priority;
  dueDate: string;
  completed: boolean;
  completedDate?: string;
  notes?: string;
}

export interface SuggestedTask {
    taskName: string;
    category: Category;
    priority: Priority;
    recommendedFrequency: string;
}
