import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { ProveedorComponent } from './proveedor/proveedor.component';
import { ClienteComponent } from './cliente/cliente.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [MatButtonModule, MatTableModule, CommonModule,
    ProveedorComponent, ClienteComponent
  ],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent {
  vistaActual: 'proveedor' | 'cliente' = 'proveedor';

  constructor(private router: Router) {}

  ngOnInit() {
    // La vista 'cuentaC' ya está establecida por defecto
  }

  cambiarVista(vista: 'proveedor' | 'cliente') {
    this.vistaActual = vista;
  }

}
