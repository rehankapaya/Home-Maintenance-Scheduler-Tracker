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
  HVAC = 'HVAC',
}

export enum InventoryCategory {
    Appliance = 'Appliance',
    Electronics = 'Electronics',
    Furniture = 'Furniture',
    Tools = 'Tools',
    HVAC = 'HVAC',
    Plumbing = 'Plumbing',
    Paint = 'Paint',
    Other = 'Other',
}

export enum UserRole {
  Homeowner = 'Homeowner',
  Tenant = 'Tenant',
  PropertyManager = 'Property Manager',
}

export enum RecurrenceRule {
  None = 'None',
  Daily = 'Daily',
  Weekly = 'Weekly',
  Monthly = 'Monthly',
  Seasonal = 'Seasonal', // e.g., Quarterly
  Yearly = 'Yearly',
}

export enum NotificationType {
  Upcoming = 'Upcoming',
  Overdue = 'Overdue',
  Warranty = 'Warranty',
}

export type SyncStatus = 'synced' | 'syncing' | 'offline';

export interface Attachment {
    id: string;
    fileName: string;
    fileType: string;
    // In a real app, this would be a URL to the stored file
    url: string; 
}

export interface AppNotification {
  id: string;
  relatedId: string; // Can be taskId or inventoryItemId
  title: string;
  message: string;
  type: NotificationType;
  date: string; // ISO string for when the notification was created
  read: boolean;
}

export interface Property {
  id: string;
  name: string;
  address: string;
  description: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: 'Sparkles' | 'CalendarDays' | 'CheckBadge' | 'Trophy';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  properties: Property[];
  points: number;
  unlockedBadges: string[];
}

export interface Tenant {
  id: string;
  propertyId: string;
  name: string;
  email?: string;
  phone?: string;
  moveInDate?: string;
}

export interface ServiceProvider {
  id: string;
  name: string;
  specialty: Category | 'General Contractor';
  contactPerson?: string;
  phone?: string;
  email?: string;
}

export interface InventoryItem {
    id: string;
    propertyId: string;
    name: string;
    category: InventoryCategory;
    purchaseDate?: string;
    price?: number;
    warrantyExpiryDate?: string;
    modelNumber?: string;
    serialNumber?: string;
    notes?: string;
    attachments?: Attachment[];
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
  cost?: number;
  recurrence?: RecurrenceRule;
  serviceProviderId?: string;
  tenantId?: string;
  attachments?: Attachment[];
}

export interface SuggestedTask {
    taskName: string;
    category: Category;
    priority: Priority;
    recommendedFrequency: string;
    recommendedProfessional?: string;
}

export interface PersonalizedRecommendation {
    taskName: string;
    category: Category;
    priority: Priority;
    recommendedFrequency: string;
    recommendedProfessional?: string;
    reason: string;
}