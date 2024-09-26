import { Component } from '@angular/core';
import { ConfirmarComponent } from './confirmar/confirmar.component';
import { CuentasComponent } from './cuentas/cuentas.component';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-movimientos',
  standalone: true,
  imports: [
    MatButtonModule,
    CommonModule,
    MatTabsModule,
    ConfirmarComponent,
    CuentasComponent
],
  templateUrl: './movimientos.component.html',
  styleUrls: ['./movimientos.component.css']
})
export class MovimientosComponent {
  vistaActual: 'confirmar' | 'cuentas'= 'confirmar';
  selectedIndex: number = 0;

  constructor(private router: Router, public dialog: MatDialog) {}

  ngOnInit() {
    // La vista 'entradas' ya está establecida por defecto
  }

  cambiarVista(index: number) {
    const vistas = ['confirmar', 'cuentas'];
    this.vistaActual = vistas[index] as 'confirmar' | 'cuentas';
  }
}
