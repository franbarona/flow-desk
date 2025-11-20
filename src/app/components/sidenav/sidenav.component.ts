import { Component, inject, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { SidebarService } from '../../services/sidebar.service';
import { ModalService } from '../../services/modal.service';
import { WindowSizeService } from '../../services/window-size.service';
import { ContextMenuAction } from '../shared/context-menu/context-menu.component';
import { SharedModule } from '../shared/shared.module';

interface MenuItem {
  label: string;
  route: string;
  icon?: string;
  iconColor?: string;
  subItems?: MenuItem[];
  actions?: ContextMenuAction[];
}

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  imports: [SharedModule, RouterModule],
})
export class SidenavComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly windowSizeService = inject(WindowSizeService);
  private readonly sidebarService = inject(SidebarService);
  private readonly modalService = inject(ModalService);

  currentRoute: string = '';
  currentMenuActions: ContextMenuAction[] = [];
  showMenu = false;
  menuPosition = { x: 0, y: 0 };

  get isOpen() {
    return this.sidebarService.isOpen;
  }

  get isDesktopSize () {
    return this.windowSizeService.isLargeScreen();
  }

  menuItems: MenuItem[] = [
    {
      label: 'Projects',
      route: '/projects',
      icon: 'folder',
      subItems: [
        {
          label: 'Median',
          route: 'median',
          icon: 'square',
          iconColor: 'pink',
        },
        {
          label: 'Risen',
          route: 'risen',
          icon: 'square',
          iconColor: 'blue',
        },
        {
          label: 'Statra Insurance',
          route: 'strata-insurance',
          icon: 'square',
          iconColor: 'orange',
        },
      ],
      actions: [
        {
          action: () => this.navigateToRoute('/projects'),
          label: 'Manage Projects',
        },
      ],
    },
    {
      label: 'Tags',
      route: '/tags-management',
      icon: 'style',
    },
    {
      label: 'Users',
      route: '/user-management',
      icon: 'people_alt',
    },
    {
      label: 'Settings',
      route: '/settings',
      icon: 'settings',
    },
  ];

  openSubmenus: boolean[] = [];

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url;
      }
    });
    this.openSubmenus = new Array(this.menuItems.length).fill(true);
  }

  // ✅ Solo para proyectos (subitems)
  navigateToProject(slug: string) {
    this.router.navigate(['/project', slug]);
  }

  // ✅ Para rutas normales
  navigateToRoute(route: string, event?: Event) {
    event?.stopPropagation();
    this.router.navigate([route]);
  }

  addNewTask() {
    this.modalService.openModal();
  }

  isProjectActive(slug: string): boolean {
    return this.currentRoute === `/project/${slug}`;
  }

  isRouteActive(route: string): boolean {
    return this.currentRoute === route;
  }

  hasActiveSubItem(menuItem: MenuItem): boolean {
    if (!menuItem.subItems) return false;

    return menuItem.subItems.some((subItem) => this.currentRoute === `/project/${subItem.route}`);
  }

  isMenuItemActive(menuItem: MenuItem): boolean {
    if (!menuItem.subItems) {
      return this.isRouteActive(menuItem.route);
    }

    return this.hasActiveSubItem(menuItem);
  }

  // MENU ACTIONS
  toggleSubmenu(index: number): void {
    this.openSubmenus[index] = !this.openSubmenus[index];
  }

  toggleSidenav(): void {
    this.sidebarService.toggle();
  }

  openSidenav(): void {
    this.sidebarService.open();
  }

  closeSidenav(): void {
    this.sidebarService.close();
  }

  // CONTEXT MENU ACTIONS
  showOptionsMenu(item: MenuItem, event: MouseEvent) {
    event.stopPropagation();
    this.currentMenuActions = item.actions!;
    this.showMenuAtButton(event);
  }

  onActionSelected(action: ContextMenuAction) {
    action.action();
  }

  onContextMenuClosed() {
    this.showMenu = false;
  }

  private showMenuAtButton(event: MouseEvent) {
    const buttonRect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    // Show the menu under clicked button
    this.menuPosition = {
      x: buttonRect.left,
      y: buttonRect.bottom + 5,
    };

    this.showMenu = true;
  }
}
