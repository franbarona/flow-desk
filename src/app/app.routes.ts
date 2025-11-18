import { Routes } from '@angular/router';
import { TaskBoardComponent } from './components/task-board/task-board.component';
import { UsersView } from './views/users/users.view';

export const routes: Routes = [
  {
    path: '',
    component: TaskBoardComponent
  },
  {
    path: 'users',
    component: UsersView
  },
];
