import { EnumPriorities, EnumStatus } from "../constants/constants";
import { Tag } from "./tag.interface";
import { User } from "./user.interface";

export interface Column {
  id: EnumStatus;
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
  status: EnumStatus;
  tagIds: string[];
  assignedUserIds: string[];
}

export interface UpdateTaskStatusRequest {
  id: string,
  status: EnumStatus
}

export interface CreateTaskRequest extends TaskRequest {}

export interface UpdateTaskRequest extends TaskRequest {
  id: string;
}
