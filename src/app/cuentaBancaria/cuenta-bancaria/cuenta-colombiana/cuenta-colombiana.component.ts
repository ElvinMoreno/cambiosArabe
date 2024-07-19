import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { CuentaBancaria } from '../../../interfaces/cuenta-bancaria';
import { CuentaBancariaService } from '../../../services/cuenta-bancaria.service';
import { ActualizarCuentaBancariaComponent } from '../actualizar-cuenta-bancaria/actualizar-cuenta-bancaria.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-cuenta-colombiana',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    CommonModule
  ],
  templateUrl: './cuenta-colombiana.component.html',
  styleUrls: ['./cuenta-colombiana.component.css']
})
export class CuentaColombianaComponent implements OnInit {
  cuentasBancarias: CuentaBancaria[] = [];

  constructor(private cuentaBancariaService: CuentaBancariaService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadCuentasColombianas();
  }

  loadCuentasColombianas(): void {
    this.cuentaBancariaService.getCuentasColombianas().subscribe(
      (data: CuentaBancaria[]) => {
        this.cuentasBancarias = data;
      },
      (error) => {
        console.error('Error al obtener las cuentas bancarias colombianas:', error);
      }
    );
  }
  openActualizarModal(cuenta: CuentaBancaria): void {
    const dialogRef = this.dialog.open(ActualizarCuentaBancariaComponent, {
      width: '600px',
      data: { cuentaBancaria: cuenta }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCuentasColombianas();  // Recargar la lista después de actualizar
      }
    });
  }
}