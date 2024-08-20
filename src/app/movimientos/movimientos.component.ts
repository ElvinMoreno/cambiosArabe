import { Component } from '@angular/core';
import { ConfirmarComponent } from './confirmar/confirmar.component';
import { CuentasComponent } from './cuentas/cuentas.component';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfirmarBsComponent } from "./confirmar-bs/confirmar-bs.component";

@Component({
  selector: 'app-movimientos',
  standalone: true,
  imports: [
    MatButtonModule,
    CommonModule,
    MatTabsModule,
    ConfirmarComponent,
    CuentasComponent,
    ConfirmarBsComponent
],
  templateUrl: './movimientos.component.html',
  styleUrls: ['./movimientos.component.css']
})
export class MovimientosComponent {
  vistaActual: 'confirmar' | 'confirmarBs' | 'cuentas'= 'confirmar';
  selectedIndex: number = 0;

  constructor(private router: Router, public dialog: MatDialog) {}

  ngOnInit() {
    // La vista 'entradas' ya está establecida por defecto
  }

  cambiarVista(index: number) {
    const vistas = ['confirmar', 'confirmarBs', 'cuentas'];
    this.vistaActual = vistas[index] as 'confirmar' | 'confirmarBs' | 'cuentas';
  }
}
