import { Component, inject, NgZone, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarService } from './services/sidebar.service';
import { SharedModule } from './components/shared/shared.module';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { WindowSizeService } from './services/window-size.service';
import { TagService } from './services/tag.service';
import { TaskService } from './services/task.service';
import { ProjectService } from './services/project.service';
import { UserService } from './services/user.service';
import { SplashComponent } from './components/splash/splash.component';
import { SPLASH_DURATION } from './constants/constants';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SharedModule, SidenavComponent, SplashComponent],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  sidebarService = inject(SidebarService);
  windowSizeService = inject(WindowSizeService);
  private readonly ngZone = inject(NgZone);
  private readonly projectService = inject(ProjectService);
  private readonly tagService = inject(TagService);
  private readonly userService = inject(UserService);
  private readonly taskService = inject(TaskService);
  showSplash: boolean = false;

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

  ngOnInit(): void {
    if (globalThis.sessionStorage?.getItem('initialized') === null) {
      this.showSplashAnimation();
    }
  }

  showSplashAnimation(): void {
    this.showSplash = true;
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        this.ngZone.run(() => {
          this.showSplash = false;
          globalThis.sessionStorage?.setItem('initialized', 'true');
        });
      }, SPLASH_DURATION);
    });
  }

  get isDesktopSize() {
    return this.windowSizeService.isLargeScreen();
  }

  toggleSidebar(): void {
    this.sidebarService.toggle();
  }
}
