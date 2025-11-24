import {User} from '../models/user.interface';
import { Project } from '../models/project.interface';
import { Tag } from '../models/tag.interface';
import { Column, EnumTaskPriority, Task } from '../models/task.interface';

export const MOCK_USERS_DATA: User[] = [
  { id: '1', name: 'Carlos', surnames: 'Rodríguez', avatarUrl: 'users/user1.jpg' },
  { id: '2', name: 'María', surnames: 'López Hernández', avatarUrl: 'users/user2.jpg' },
  { id: '3', name: 'Andrea', surnames: 'Martínez', avatarUrl: 'users/user3.jpg' },
  { id: '4', name: 'Javier', surnames: 'Santos Pérez', avatarUrl: 'users/user4.jpg' },
  { id: '5', name: 'Ana', surnames: 'Ortega', avatarUrl: 'users/user5.jpg' },
  { id: '6', name: 'Leandro', surnames: 'Zurrik', avatarUrl: 'users/user6.jpg' },
  { id: '7', name: 'Marc', surnames: 'Dojvik', avatarUrl: 'users/user7.jpg' },
];

export const MOCK_TAGS_DATA: Tag[] = [
  { id: '1', name: 'Prototype', color: 'violet' },
  { id: '2', name: 'Research', color: 'pink' },
  { id: '3', name: 'Design', color: 'blue' },
  { id: '4', name: 'Frontend', color: 'red' },
  { id: '5', name: 'Backend', color: 'teal' },
  { id: '6', name: 'Design system', color: 'yellow' },
];

export const MOCK_PROJECTS_DATA: Project[] = [
  { id: '156235', name: 'Median', slug: 'median', color:'pink' },
  { id: '839328', name: 'Risen', slug: 'risen', color: 'blue' },
  { id: '524946', name: 'Strata Insurance', slug: 'strata-insurance', color: 'amber' },
];

export const MOCK_TASKS_DATA: Task[] = [
  // TODO
  {
    id: '5',
    projectId: '156235',
    title: 'Research DB options for new microservice',
    description: '',
    startDate: new Date(),
    endDate: new Date(),
    status: 'todo',
    priority: EnumTaskPriority.LOW,
    tags: [MOCK_TAGS_DATA[1], MOCK_TAGS_DATA[2]],
    assignedUsers: [MOCK_USERS_DATA[1], MOCK_USERS_DATA[3]],
  },
  {
    id: '7',
    projectId: '156235',
    title: 'Sync with product on Q3 roadmap',
    description: '',
    startDate: new Date(),
    endDate: new Date(),
    status: 'todo',
    priority: EnumTaskPriority.MEDIUM,
    tags: [MOCK_TAGS_DATA[2]],
    assignedUsers: [MOCK_USERS_DATA[0], MOCK_USERS_DATA[1], MOCK_USERS_DATA[3]],
  },
  // DOING
  {
    id: '8',
    projectId: '156235',
    title: 'Refactor context providers to use Zustand',
    description: '',
    startDate: new Date(),
    endDate: new Date(),
    status: 'doing',
    priority: EnumTaskPriority.HIGH,
    tags: [MOCK_TAGS_DATA[2], MOCK_TAGS_DATA[3]],
    assignedUsers: [MOCK_USERS_DATA[4]],
  },
  {
    id: '9',
    projectId: '156235',
    title: 'Add logging to daily CRON',
    description: '',
    startDate: new Date(),
    endDate: new Date(),
    status: 'doing',
    priority: EnumTaskPriority.LOW,
    tags: [MOCK_TAGS_DATA[3]],
    assignedUsers: [MOCK_USERS_DATA[6]],
  },
  // DONE
  {
    id: '10',
    projectId: '156235',
    title: 'Set up DD dashboards for Lambda listener',
    description: '',
    startDate: new Date(),
    endDate: new Date(),
    status: 'done',
    priority: EnumTaskPriority.MEDIUM,
    tags: [MOCK_TAGS_DATA[0], MOCK_TAGS_DATA[4]],
    assignedUsers: [MOCK_USERS_DATA[5], MOCK_USERS_DATA[6]],
  },
];

export const MOCK_COLUMNS_DATA: Column[] = [
  {
    id: 'todo',
    title: 'To Do',
  },
  {
    id: 'doing',
    title: 'In Progress',
  },
  {
    id: 'done',
    title: 'Done',
  },
];
