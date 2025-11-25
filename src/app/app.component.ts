import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarService } from './services/sidebar.service';
import { SharedModule } from './components/shared/shared.module';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { WindowSizeService } from './services/window-size.service';
import { TagService } from './services/tag.service';
import { TaskService } from './services/task.service';
import { ProjectService } from './services/project.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SharedModule, SidenavComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  sidebarService = inject(SidebarService);
  windowSizeService = inject(WindowSizeService);
  private readonly projectService = inject(ProjectService);
  private readonly tagService = inject(TagService);
  private readonly userService = inject(UserService);
  private readonly taskService = inject(TaskService);

  constructor() {
    // Init mock data if localStorage is empty
    if (globalThis.localStorage?.getItem('projects') === null) {
      this.projectService.initializeProjectsSampleData();
    }

    if (globalThis.localStorage?.getItem('tags') === null) {
      this.tagService.initializeTagsSampleData();
    }

    if (globalThis.localStorage?.getItem('users') === null) {
      this.userService.initializeUsersSampleData();
    }

    if (globalThis.localStorage?.getItem('tasks') === null) {
      this.taskService.initializeTasksSampleData();
    }
  }

  get isDesktopSize() {
    return this.windowSizeService.isLargeScreen();
  }

  toggleSidebar(): void {
    this.sidebarService.toggle();
  }
}
