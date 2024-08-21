import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';

import { ConfirmarPagoComponent } from './confirmar-pago/confirmar-pago.component';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmarEntradaBsComponent } from './confirmar-entrada-bs/confirmar-entrada-bs.component';

@Component({
  selector: 'app-confirmar-bs',
  standalone: true,
  imports: [
    MatButtonModule,
    CommonModule,
    MatTabsModule,
    ConfirmarEntradaBsComponent,
    ConfirmarPagoComponent
  ],
  templateUrl: './confirmar-bs.component.html',
  styleUrl: './confirmar-bs.component.css'
})
export class ConfirmarBsComponent {
  vistaActual: 'entradas' | 'pagos' = 'entradas';
  selectedIndex: number = 0;

  constructor(private router: Router, public dialog: MatDialog) {}

  ngOnInit() {
    // La vista 'entradas' ya está establecida por defecto
  }

  cambiarVista(index: number) {
    const vistas = ['entradas', 'salidas'];
    this.vistaActual = vistas[index] as 'entradas' | 'pagos';
  }
}
