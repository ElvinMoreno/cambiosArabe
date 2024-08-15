import { Component } from '@angular/core';
import { RetiroTotalComponent } from './retiro-total/retiro-total.component';
import { RevisarComponent } from './revisar/revisar.component';
import { UsoMontoComponent } from './uso-monto/uso-monto.component';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-cuentas',
  standalone: true,
  imports: [
    MatButtonModule,
    CommonModule,
    MatTabsModule,
    RetiroTotalComponent,
    RevisarComponent,
    UsoMontoComponent
  ],
  templateUrl: './cuentas.component.html',
  styleUrl: './cuentas.component.css'
})
export class CuentasComponent {
  vistaActual: 'revisar' | 'uso' | 'retiro' = 'revisar';
  selectedIndex: number = 0;

  constructor(private router: Router, public dialog: MatDialog) {}

  ngOnInit() {
    // La vista 'entradas' ya está establecida por defecto
  }

  cambiarVista(index: number) {
    const vistas = ['revisar', 'uso', 'retiro'];
    this.vistaActual = vistas[index] as 'revisar'
    | 'uso'  | 'retiro' ;
  }
}
