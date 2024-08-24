import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { RouterModule, Router } from '@angular/router'; // Importa Router para la navegación
import { MatNavList } from '@angular/material/list';
import { MatDivider, MatDividerModule } from '@angular/material/divider';
import { navbarData } from './nav-data';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AccesoService } from '../../services/acceso.service'; // Importa el servicio de acceso

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'sidebar-polania',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatToolbar,
    MatIcon,
    RouterModule,
    MatNavList,
    MatDivider,
    MatDividerModule,
    MatIconModule
  ],
  templateUrl: './sidebar-polania.component.html',
  styleUrls: ['./sidebar-polania.component.css']
})
export class SidebarPolaniaComponent implements OnInit {
  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();
  collapsad = false;
  screenWidth = 0;
  navData = navbarData;
  isMobile = false;
  showOverlay = false;

  constructor(private accesoService: AccesoService, private router: Router) {} // Inyecta el servicio y Router

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    this.isMobile = this.screenWidth <= 768;
    if (this.isMobile) {
      this.collapsad = false;
      this.showOverlay = false;
      this.onToggleSideNav.emit({ collapsed: this.collapsad, screenWidth: this.screenWidth });
    }
  }

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
    this.isMobile = this.screenWidth <= 768;
  }

  toggleCollapse(): void {
    this.collapsad = !this.collapsad;
    this.showOverlay = this.isMobile && this.collapsad;
    this.onToggleSideNav.emit({ collapsed: this.collapsad, screenWidth: this.screenWidth });
  }

  closeSidenav(): void {
    this.collapsad = false;
    this.showOverlay = false;
    this.onToggleSideNav.emit({ collapsed: this.collapsad, screenWidth: this.screenWidth });
  }

  closeOnSelect(): void {
    if (this.isMobile) {
      this.closeSidenav();
    }
  }

  handleOverlayClick(): void {
    if (this.isMobile) {
      this.closeSidenav();
    }
  }

  // Método para cerrar sesión
  logout(): void {
    localStorage.removeItem('token'); // Elimina el token del almacenamiento local
    this.router.navigate(['/login']); // Redirige al usuario a la página de inicio de sesión
  }
}
