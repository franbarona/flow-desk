import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarService } from './services/sidebar.service';
import { SharedModule } from './components/shared/shared.module';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { WindowSizeService } from './services/window-size.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SharedModule, SidenavComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  sidebarService = inject(SidebarService);
  windowSizeService = inject(WindowSizeService);

  get isDesktopSize () {
    return this.windowSizeService.isLargeScreen();
  }

  toggleSidebar(): void {
    this.sidebarService.toggle();
  }
}
