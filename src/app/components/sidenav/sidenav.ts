import { Component, inject, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { SidebarService } from '../../services/sidebar.service';

interface MenuItem {
  label: string;
  route: string;
}

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.html',
  styleUrls: ['./sidenav.scss'],
  imports: [RouterModule, CommonModule],
})
export class SidenavComponent implements OnInit {
  private readonly platformId = inject(PLATFORM_ID)
  private readonly sidebarService = inject(SidebarService);
  get isOpen () {
    return this.sidebarService.isOpen;
  }

  menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      route: '/dashboard',
    },
    {
      label: 'Productos',
      route: '/productos',
    },
    {
      label: 'Usuarios',
      route: '/usuarios',
    },
    {
      label: 'Configuración',
      route: '/configuracion',
    },
  ];

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
