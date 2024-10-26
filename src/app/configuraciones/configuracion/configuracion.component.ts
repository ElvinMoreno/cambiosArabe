import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { DescripcionComponent } from './switchbutton/descripcion/descripcion.component';
import { GastosComponent } from './switchbutton/gastos/gastos.component';
import { ProveedorComponent } from '../../usuarios/proveedor/proveedor.component';
import { ClienteComponent } from '../../usuarios/cliente/cliente.component';
import { HistoryComponent } from './switchbutton/history/history.component';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatTabsModule,
    DescripcionComponent,
    GastosComponent,
    ProveedorComponent,
    ClienteComponent,
    HistoryComponent
  ],
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.css']
})
export class ConfiguracionComponent {

  constructor(private router: Router) {}

  selectedIndex: number = 0;
  vistaActual: 'descripcion' | 'gastos' | 'proveedor' | 'cliente' | 'historial' = 'descripcion';

  ngOnInit() {
    // La vista 'descripcion' ya está establecida por defecto
  }

  cambiarVista(index: number) {
    const vistas = ['descripcion', 'gastos', 'proveedor', 'cliente', 'historial'];
    this.vistaActual = vistas[index] as 'descripcion' | 'gastos' | 'proveedor' | 'cliente' | 'historial';
  }
}
