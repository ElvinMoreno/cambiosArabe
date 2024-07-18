import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { CuentaColombianaComponent } from './cuenta-colombiana/cuenta-colombiana.component';
import { CuentaVenezolanaComponent } from './cuenta-venezolana/cuenta-venezolana.component';
import { CrearCuentaBancariaComponent } from './crear-cuenta-bancaria/crear-cuenta-bancaria.component';

@Component({
  selector: 'app-cuenta-bancaria',
  standalone: true,
  imports: [
    MatButtonModule,
    CommonModule,
    CuentaColombianaComponent,
    CuentaVenezolanaComponent
  ],
  templateUrl: './cuenta-bancaria.component.html',
  styleUrls: ['./cuenta-bancaria.component.css']
})
export class CuentaBancariaComponent {
  vistaActual: 'cuentaC' | 'cuentaV' = 'cuentaC';

  constructor(private router: Router, public dialog: MatDialog) {}

  ngOnInit() {
    // La vista 'cuentaC' ya está establecida por defecto
  }

  cambiarVista(vista: 'cuentaC' | 'cuentaV') {
    this.vistaActual = vista;
  }

  openCrearCuentaBancaria(): void {
    const dialogRef = this.dialog.open(CrearCuentaBancariaComponent, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Aquí puedes agregar la lógica para actualizar la lista de cuentas bancarias si es necesario
      }
    });
  }
}
