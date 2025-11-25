import { EnumPriorities } from "../constants/mocks";
import { Tag } from "./tag.interface";
import { User } from "./user.interface";

export interface Column {
  id: string;
  title: string;
}
export interface Task {
  id: string;
  projectId?: string;
  title: string;
  description: string;
  status: 'backlog' | 'todo' | 'doing' | 'done';
  priority: EnumPriorities;
  startDate: Date;
  endDate: Date;
  tagIds: string[];
  assignedUserIds: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PopulatedTask extends Task {
  tags: Tag[]; // populated Tags
  assignedUsers: User[]; // populated Users
}

export interface DragData {
  cardId: string;
}

export interface TaskRequest {
  projectId: string,
  priority: EnumPriorities;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'backlog' | 'todo' | 'doing' | 'done';
  tagIds: string[];
  assignedUserIds: string[];
}

export interface CreateTaskRequest extends TaskRequest {}

export interface UpdateTaskRequest extends TaskRequest {
  id: string;
}
