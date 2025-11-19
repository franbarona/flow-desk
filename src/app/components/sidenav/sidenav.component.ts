import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { SidebarService } from '../../services/sidebar.service';
import { ModalService } from '../../services/modal.service';
import { IconComponent } from '../icon/icon.component';
import e from 'express';

interface MenuItem {
  label: string;
  route: string;
  icon?: string;
  iconColor?: string;
  subItems?: MenuItem[];
}

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  imports: [CommonModule, IconComponent, RouterModule], // ✅ Agregado RouterModule
})
export class SidenavComponent implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly sidebarService = inject(SidebarService);
  private readonly modalService = inject(ModalService);
  private readonly router = inject(Router);

  currentRoute: string = '';

  get isOpen() {
    return this.sidebarService.isOpen;
  }

  menuItems: MenuItem[] = [
    // {
    //   label: 'Task List',
    //   route: '/tasks',
    //   icon: 'content_paste',
    // },
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
    if (isPlatformBrowser(this.platformId)) {
      if (window.innerWidth >= 1024) {
        this.openSidenav();
      } else {
        this.closeSidenav();
      }
    }
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
}
