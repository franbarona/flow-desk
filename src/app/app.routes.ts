import { Routes } from '@angular/router';
import { UsersView } from './views/users/users.view';
import { ProjectsView } from './views/projects/projects.view';
import { SettingsView } from './views/settings/settings.view';
import { TagsView } from './views/tags/tags.view';
import { TasksView } from './views/tasks/tasks.view';

export const routes: Routes = [
  { path: '', redirectTo: '/projects', pathMatch: 'full' },
  { path: 'projects', component: ProjectsView },
  { path: 'project/:id', component: TasksView },
  { path: 'user-management', component: UsersView },
  { path: 'tags-management', component: TagsView },
  { path: 'settings', component: SettingsView },
  { path: '**', redirectTo: '/projects' }
];