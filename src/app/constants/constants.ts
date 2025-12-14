import { Column } from '../models/task.interface';

export const SPLASH_DURATION: number = 4000;

export const ROUTE_MAP = [
  { template: '/project/{id}', label: 'task' },
  { template: '/projects', label: 'project' },
  { template: '/tags-management', label: 'tag' },
  { template: '/user-management', label: 'user' },
];

export enum EnumPriorities {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum EnumStatus {
  BACKLOG = 'backlog',
  TODO = 'todo',
  DOING = 'doing',
  DONE = 'done',
}

export const TASK_BOARD_COLUMNS_DATA: Column[] = [
  {
    id: EnumStatus.TODO,
    title: 'ToDo',
  },
  {
    id: EnumStatus.DOING,
    title: 'In Progress',
  },
  {
    id: EnumStatus.DONE,
    title: 'Done',
  },
];
