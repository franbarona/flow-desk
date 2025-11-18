import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { SidebarService } from '../../services/sidebar.service';
import { ModalService } from '../../services/modal.service';
import { IconComponent } from '../icon/icon.component';

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
  imports: [RouterModule, CommonModule, IconComponent],
})
export class SidenavComponent implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly sidebarService = inject(SidebarService);
  private readonly modalService = inject(ModalService);
  isModalOpen = false;
  get isOpen() {
    return this.sidebarService.isOpen;
  }

  menuItems: MenuItem[] = [
    {
      label: 'Task List',
      route: '',
      icon: 'content_paste',
    },
    {
      label: 'Projects',
      route: '/projects',
      icon: 'folder',
      subItems: [
        {
          label: 'Median',
          route: '/projects/median',
          icon: 'square',
          iconColor: 'pink',
        },
        {
          label: 'Risen',
          route: '/projects/risen',
          icon: 'square',
          iconColor: 'blue',
        },
        {
          label: 'Statra Insurance',
          route: '/projects/strata-insurance',
          icon: 'square',
          iconColor: 'orange',
        },
      ],
    },
    {
      label: 'Tags',
      route: 'tags',
      icon: 'style',
    },
    {
      label: 'Users',
      route: 'users',
      icon: 'people_alt',
    },
    {
      label: 'Settings',
      route: 'settings',
      icon: 'settings',
    },
  ];

  openSubmenus: boolean[] = [];

  ngOnInit(): void {
    // Verificar si estamos en el navegador
    if (isPlatformBrowser(this.platformId)) {
      // En desktop, el sidebar está abierto por defecto
      if (window.innerWidth >= 1024) {
        this.openSidenav();
      } else {
        this.closeSidenav();
      }
    }
    this.openSubmenus = new Array(this.menuItems.length).fill(true);
  }

  addNewTask() {
    this.modalService.openTaskModal();
  }

  toggleSubmenu(index: number): void {
    this.openSubmenus[index] = !this.openSubmenus[index];
  }

  // Opcional: método para cerrar todos los submenús
  closeAllSubmenus(): void {
    this.openSubmenus.fill(false);
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
