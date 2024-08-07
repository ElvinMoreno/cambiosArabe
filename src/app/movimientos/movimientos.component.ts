import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfirmarEntradaComponent } from './confirmar-entrada/confirmar-entrada.component';
import { ConfirmarSalidaComponent } from './confirmar-salida/confirmar-salida.component';

@Component({
  selector: 'app-movimientos',
  standalone: true,
  imports: [
    MatButtonModule,
    CommonModule,
    MatTabsModule,
    ConfirmarEntradaComponent,
    ConfirmarSalidaComponent
  ],
  templateUrl: './movimientos.component.html',
  styleUrls: ['./movimientos.component.css']
})
export class MovimientosComponent {
  vistaActual: 'entradas' | 'salidas' = 'entradas';
  selectedIndex: number = 0;

  constructor(private router: Router, public dialog: MatDialog) {}

  ngOnInit() {
    // La vista 'entradas' ya está establecida por defecto
  }

  cambiarVista(index: number) {
    const vistas = ['entradas', 'salidas'];
    this.vistaActual = vistas[index] as 'entradas' | 'salidas';
  }
}
