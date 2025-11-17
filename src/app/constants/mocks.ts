import { User, Column, EnumTaskPriority, Tag, Task } from '../models/task.interface';


export const MOCK_USERS_DATA: User[] = [
  { id: 1, name: 'Carlos', surnames: 'Rodríguez', avatarUrl: 'users/user1.jpg' },
  { id: 2, name: 'María', surnames: 'López Hernández', avatarUrl: 'users/user2.jpg' },
  { id: 3, name: 'Andrea', surnames: 'Martínez', avatarUrl: 'users/user3.jpg' },
  { id: 4, name: 'Javier', surnames: 'Santos Pérez', avatarUrl: 'users/user4.jpg' },
  { id: 5, name: 'Ana', surnames: 'Ortega', avatarUrl: 'users/user5.jpg' },
  { id: 6, name: 'Leandro', surnames: 'Zurrik', avatarUrl: 'users/user6.jpg' },
  { id: 7, name: 'Marc', surnames: 'Dojvik', avatarUrl: 'users/user7.jpg' },
];

export const MOCK_TAGS_DATA: Tag[] = [
  { id: 1, name: 'Prototype', color: '#6D28D9' },
  { id: 2, name: 'Research', color: '#BE185D' },
  { id: 3, name: 'Design', color: '#1D4ED8' },
  { id: 4, name: 'Frontend', color: '#B91C1C' },
  { id: 5, name: 'Backend', color: '#047857' },
  { id: 6, name: 'Design system', color: '#A16207' },
];


export const MOCK_TASKS_DATA: Task[] = [
  // TODO
  {
    id: '5',
    title: 'Research DB options for new microservice',
    description: '',
    startDate: new Date(),
    endDate: new Date(),
    column: 'todo',
    priority: EnumTaskPriority.LOW,
    tags: [MOCK_TAGS_DATA[1], MOCK_TAGS_DATA[2]],
    assignedUsers: [MOCK_USERS_DATA[1], MOCK_USERS_DATA[3]],
  },
  {
    id: '7',
    title: 'Sync with product on Q3 roadmap',
    description: '',
    startDate: new Date(),
    endDate: new Date(),
    column: 'todo',
    priority: EnumTaskPriority.MEDIUM,
    tags: [MOCK_TAGS_DATA[2]],
    assignedUsers: [MOCK_USERS_DATA[0], MOCK_USERS_DATA[1], MOCK_USERS_DATA[3]],
  },
  // DOING
  {
    id: '8',
    title: 'Refactor context providers to use Zustand',
    description: '',
    startDate: new Date(),
    endDate: new Date(),
    column: 'doing',
    priority: EnumTaskPriority.HIGH,
    tags: [MOCK_TAGS_DATA[2], MOCK_TAGS_DATA[3]],
    assignedUsers: [MOCK_USERS_DATA[4]],
  },
  {
    id: '9',
    title: 'Add logging to daily CRON',
    description: '',
    startDate: new Date(),
    endDate: new Date(),
    column: 'doing',
    priority: EnumTaskPriority.LOW,
    tags: [MOCK_TAGS_DATA[3]],
    assignedUsers: [MOCK_USERS_DATA[6]],
  },
  // DONE
  {
    id: '10',
    title: 'Set up DD dashboards for Lambda listener',
    description: '',
    startDate: new Date(),
    endDate: new Date(),
    column: 'done',
    priority: EnumTaskPriority.MEDIUM,
    tags: [MOCK_TAGS_DATA[0], MOCK_TAGS_DATA[4]],
    assignedUsers: [MOCK_USERS_DATA[5], MOCK_USERS_DATA[6]],
  },
];

export const MOCK_COLUMNS_DATA: Column[] = [
  // {
  //   id: 'backlog',
  //   title: 'Backlog',
  // },
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
