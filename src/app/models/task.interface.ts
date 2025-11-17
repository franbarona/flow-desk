export interface Column {
  id: string;
  title: string;
}
export interface Task {
  id: string;
  title: string;
  description: string;
  column: 'backlog' | 'todo' | 'doing' | 'done';
  priority: EnumTaskPriority;
  startDate: Date;
  endDate: Date;
  assignedUsers: User[];
  tags: Tag[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Tag {
  id: number;
  name: string;
  color: string;
}


export interface User {
  id: number;
  name: string;
  surnames: string;
  avatarUrl: string;
}

export interface DragData {
  cardId: string;
}

export enum EnumTaskPriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  assignedUserIds: number[];
  tagIds: number[];
}

export interface UpdateTaskRequest {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  assignedUserIds: number[];
  tagIds: number[];
}
