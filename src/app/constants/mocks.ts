import { User } from '../models/user.interface';
import { Project } from '../models/project.interface';
import { Tag } from '../models/tag.interface';
import { Column, Task } from '../models/task.interface';

export enum EnumPriorities {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum EnumStatus {
  TODO = 'todo',
  DOING = 'in progress',
  DONE = 'donde',
}

export const MOCK_USERS_DATA: User[] = [
  { id: '836235', name: 'Carlos', surnames: 'Rodríguez', avatarUrl: 'users/user1.jpg' },
  { id: '455940', name: 'María', surnames: 'López Hernández', avatarUrl: 'users/user2.jpg' },
  { id: '383308', name: 'Andrea', surnames: 'Martínez', avatarUrl: 'users/user3.jpg' },
  { id: '324431', name: 'Javier', surnames: 'Santos Pérez', avatarUrl: 'users/user4.jpg' },
  { id: '719530', name: 'Ana', surnames: 'Ortega', avatarUrl: 'users/user5.jpg' },
  { id: '493598', name: 'Leandro', surnames: 'Zurrik', avatarUrl: 'users/user6.jpg' },
  { id: '688239', name: 'Marc', surnames: 'Dojvik', avatarUrl: 'users/user7.jpg' },
];

export const MOCK_TAGS_DATA: Tag[] = [
  { id: '227752', name: 'Prototype', color: 'violet' },
  { id: '690858', name: 'Research', color: 'pink' },
  { id: '715621', name: 'Design', color: 'blue' },
  { id: '732672', name: 'Frontend', color: 'red' },
  { id: '874466', name: 'Backend', color: 'teal' },
  { id: '385976', name: 'Design system', color: 'yellow' },
];

export const MOCK_PROJECTS_DATA: Project[] = [
  { id: '156235', name: 'Median', slug: 'median', color: 'pink' },
  { id: '839328', name: 'Risen', slug: 'risen', color: 'blue' },
  { id: '524946', name: 'Strata Insurance', slug: 'strata-insurance', color: 'amber' },
];

export const MOCK_TASKS_DATA: Task[] = [
  // TODO
  {
    id: '608707',
    projectId: '156235',
    title: 'Research DB options for new microservice',
    description: '',
    startDate: new Date(),
    endDate: new Date(),
    status: 'todo',
    priority: EnumPriorities.LOW,
    tagIds: ['227752', '690858'],
    assignedUserIds: [MOCK_USERS_DATA[1].id, MOCK_USERS_DATA[3].id],
  },
  {
    id: '093072',
    projectId: '156235',
    title: 'Sync with product on Q3 roadmap',
    description: '',
    startDate: new Date(),
    endDate: new Date(),
    status: 'todo',
    priority: EnumPriorities.MEDIUM,
    tagIds: ['227752'],
    assignedUserIds: [MOCK_USERS_DATA[0].id, MOCK_USERS_DATA[1].id, MOCK_USERS_DATA[3].id],
  },
  // DOING
  {
    id: '876033',
    projectId: '156235',
    title: 'Refactor context providers to use Zustand',
    description: '',
    startDate: new Date(),
    endDate: new Date(),
    status: 'doing',
    priority: EnumPriorities.HIGH,
    tagIds: ['690858', '715621'],
    assignedUserIds: [MOCK_USERS_DATA[4].id],
  },
  {
    id: '579093',
    projectId: '156235',
    title: 'Add logging to daily CRON',
    description: '',
    startDate: new Date(),
    endDate: new Date(),
    status: 'doing',
    priority: EnumPriorities.LOW,
    tagIds: ['715621'],
    assignedUserIds: [MOCK_USERS_DATA[6].id],
  },
  // DONE
  {
    id: '763434',
    projectId: '156235',
    title: 'Set up DD dashboards for Lambda listener',
    description: '',
    startDate: new Date(),
    endDate: new Date(),
    status: 'done',
    priority: EnumPriorities.MEDIUM,
    tagIds: ['732672', '874466', '385976'],
    assignedUserIds: [MOCK_USERS_DATA[5].id, MOCK_USERS_DATA[6].id],
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
