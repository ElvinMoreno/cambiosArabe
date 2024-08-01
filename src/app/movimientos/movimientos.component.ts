import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfirmarEntradaComponent } from './confirmar-entrada/confirmar-entrada.component';
import { ConfirmarSalidaComponent } from './confirmar-salida/confirmar-salida.component';

@Component({
  selector: 'app-movimientos',
  standalone: true,
  imports: [MatButtonModule,
    CommonModule,
    ConfirmarEntradaComponent,
    ConfirmarSalidaComponent
  ],
  templateUrl: './movimientos.component.html',
  styleUrl: './movimientos.component.css'
})
export class MovimientosComponent {
  vistaActual: 'entradas' | 'salidas' = 'entradas';

  constructor(private router: Router, public dialog: MatDialog) {}

  ngOnInit() {
    // La vista 'cuentaC' ya está establecida por defecto
  }

  cambiarVista(vista: 'entradas' | 'salidas') {
    this.vistaActual = vista;
  }
}
