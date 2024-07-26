import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

import { EntradasComponent } from './switchButton/entradas/entradas.component';
import { SalidasComponent } from './switchButton/salidas/salidas.component';


@Component({
  selector: 'app-caja',
  standalone: true,
  imports: [
    MatButtonModule,
    SalidasComponent,
    EntradasComponent,
    CommonModule
  ],
  templateUrl: './caja.component.html',
  styleUrl: './caja.component.css'
})
export class CajaComponent {
  vistaActual: 'entradas' | 'salidas' = 'entradas';

  ngOnInit() {
    // La vista 'compras' ya está establecida por defecto
  }

  cambiarVista(vista: 'entradas' | 'salidas') {
    this.vistaActual = vista;
  }
}
