
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

export interface Task {
  id: string;
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
