import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { RouterModule, Router } from '@angular/router';
import { MatNavList } from '@angular/material/list';
import { MatDivider, MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { CloudinaryService } from '../../services/cloudinary.service';

export const navbarDataCorresponsal = [
  {
    routerLink: 'home',
    icon: 'fa-solid fa-house',
    label: 'Casa',
  },
  {
    routerLink: ['caja'],
    icon: 'fa-solid fa-box',
    label: 'Caja',
  },
];

export const navbarData = [
  {
    routerLink: 'index',
    icon: 'fa-solid fa-house',
    label: 'Casa',
  },
  {
    routerLink: ['bolivares', 'efectivo', 'adicionales'],
    icon: 'fa-solid fa-address-book',
    label: 'Operaciones',
  },
  {
    routerLink: 'tasa',
    icon: 'fa-solid fa-mug-saucer',
    label: 'Tasa',
  },
  {
    routerLink: 'configuracion',
    icon: 'fa-solid fa-gear',
    label: 'Configuración',
  },
  {
    routerLink: 'cuentaBancaria',
    icon: 'fa-solid fa-hand-holding-dollar',
    label: 'Saldos',
  },
  {
    routerLink: 'movimientos',
    icon: 'fa-solid fa-building-user',
    label: 'Movimientos',
  },
];

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
    MatMenuModule,
    MatIcon,
    RouterModule,
    MatDividerModule,
    MatIconModule,
  ],
  templateUrl: './sidebar-polania.component.html',
  styleUrls: ['./sidebar-polania.component.css'],
})
export class SidebarPolaniaComponent implements OnInit {
  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();
  @Input() collapsad = false;
  @Input() isMobile = false;

  screenWidth = 0;
  showOverlay = false;
  logoUrl: string = ''; // Variable para la URL del logo

  navData = navbarData; // Datos iniciales del menú
  isCorresponsal = false; // Estado actual: si está en corresponsal o no
  toggleMenuText = 'Mostrar Corresponsal'; // Texto dinámico del botón de menú


  constructor(private router: Router, private cloudinaryService: CloudinaryService) {

  }

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
    this.cloudinaryService.getOptimizedUrl('tzw5bje9rf0olwacooia')
      .subscribe(
        (url: string) => {
          this.logoUrl = url; // Asignamos la URL obtenida a la variable logoUrl
        },
        (error) => {
          console.error('Error al obtener la URL del logo desde Cloudinary:', error);
        }
      );
      this.checkRoute();
  }
  checkRoute(): void {
    const currentRoute = this.router.url;
    if (currentRoute.endsWith('/home') ) {
      this.navData = navbarDataCorresponsal;
    } else {
      this.navData = navbarData;
    }
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

   // Cambiar entre "Corresponsal" y "Cambios"
   toggleMenu(): void {
    this.isCorresponsal = !this.isCorresponsal; // Cambia el estado
    if (this.isCorresponsal) {
      this.navData = navbarDataCorresponsal;
      this.toggleMenuText = 'Mostrar Cambios'; // Cambiar texto

    } else {
      this.navData = navbarData;
      this.toggleMenuText = 'Mostrar Corresponsal'; // Cambiar texto
    }
  }

  // Método para cerrar sesión
  logout(): void {
    localStorage.removeItem('token'); // Elimina el token del almacenamiento local
    this.router.navigate(['/login']); // Redirige al usuario a la página de inicio de sesión
  }
}
