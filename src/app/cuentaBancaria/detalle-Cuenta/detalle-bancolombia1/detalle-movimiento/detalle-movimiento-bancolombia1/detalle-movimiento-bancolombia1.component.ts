import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EntradaBancolombia1Component } from './switchButton/entrada-bancolombia1/entrada-bancolombia1.component';
import { SalidaBancolombia1Component } from './switchButton/salida-bancolombia1/salida-bancolombia1.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-detalle-movimiento-bancolombia1',
  standalone: true,
  imports: [
    MatIconModule,
    MatTableModule,
    CommonModule,
    MatButtonModule,
    EntradaBancolombia1Component,
    SalidaBancolombia1Component,
    CommonModule
  ],
  templateUrl: './detalle-movimiento-bancolombia1.component.html',
  styleUrl: './detalle-movimiento-bancolombia1.component.css'
})
export class DetalleMovimientoBancolombia1Component {
  constructor(private router: Router) {}

  navegar(ruta: string) {
    this.router.navigate([ruta]);
  }
  vistaActual: 'entradas' | 'salidas' = 'salidas';
  ngOnInit() {
    // La vista 'compras' ya está establecida por defecto
  }

  cambiarVista(vista: 'entradas' | 'salidas') {
    this.vistaActual = vista;

  }

}
