import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EntradaBancolombia2Component } from './switchButton/entrada-bancolombia2/entrada-bancolombia2.component';
import { SalidaBancolombia2Component } from './switchButton/salida-bancolombia2/salida-bancolombia2.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-detalle-movimiento-bancolombia2',
  standalone: true,
  imports: [MatIconModule,
    MatTableModule,
    CommonModule,
    MatButtonModule,
    EntradaBancolombia2Component,
    SalidaBancolombia2Component,
    CommonModule],
  templateUrl: './detalle-movimiento-bancolombia2.component.html',
  styleUrl: './detalle-movimiento-bancolombia2.component.css'
})
export class DetalleMovimientoBancolombia2Component {
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
