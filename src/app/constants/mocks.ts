import { User } from '../models/user.interface';
import { Project } from '../models/project.interface';
import { Tag } from '../models/tag.interface';
import { Column, EnumTaskPriority, Task } from '../models/task.interface';

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
    priority: EnumTaskPriority.LOW,
    tags: [MOCK_TAGS_DATA[1], MOCK_TAGS_DATA[2]],
    assignedUsers: [MOCK_USERS_DATA[1], MOCK_USERS_DATA[3]],
  },
  {
    id: '093072',
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
    id: '876033',
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
    id: '579093',
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
    id: '763434',
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
