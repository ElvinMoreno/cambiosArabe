import { Component, HostListener } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { ProveedorComponent } from './proveedor/proveedor.component';
import { ClienteComponent } from './cliente/cliente.component';
import { CommonModule } from '@angular/common';
import { MatCardMdImage, MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [MatButtonModule, MatTableModule, CommonModule,
    ProveedorComponent, ClienteComponent,
    MatCardModule
  ],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent {
 isDesktop!: boolean;
  data!: any[]; // Tu array de datos

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  ngOnInit() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isDesktop = window.innerWidth > 768; // Ajusta este valor según tus necesidades
  }

}
