export enum TaskPriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

export enum TaskStatus {
  TO_DO = 'To Do',
  IN_PROGRESS = 'In Progress',
  DONE = 'Done'
}

export interface User {
  id: string;
  name: string;
  email?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  priority: TaskPriority;
  status: TaskStatus;
  tags: string[];
  assignedUsers: User[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskFormData {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  priority: TaskPriority;
  tags: string[];
  assignedUsers: User[];
}
