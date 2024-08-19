import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog'; // Asegúrate de tener estas importaciones correctas
import { CuentaBancaria } from '../../../interfaces/cuenta-bancaria';
import { CuentaBancariaService } from '../../../services/cuenta-bancaria.service';
import { ActualizarCuentaBancariaComponent } from '../actualizar-cuenta-bancaria/actualizar-cuenta-bancaria.component';
import { CrearCuentaBancariaVComponent } from '../crear-cuenta-bancaria-v/crear-cuenta-bancaria-v.component';

@Component({
  selector: 'app-cuenta-venezolana',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    CommonModule,
    MatDialogModule // Asegúrate de incluir MatDialogModule en imports
  ],
  templateUrl: './cuenta-venezolana.component.html',
  styleUrls: ['./cuenta-venezolana.component.css']
})
export class CuentaVenezolanaComponent implements OnInit {
  cuentasBancarias: CuentaBancaria[] = [];

  constructor(
    private cuentaBancariaService: CuentaBancariaService, 
    public dialog: MatDialog, // Inyección de MatDialog corregida
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCuentasVenezolanas();
  }

  openCrearCuentaBancaria(): void {
    const dialogRef = this.dialog.open(CrearCuentaBancariaVComponent, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.loadCuentasVenezolanas();
      }
    });
  }

  loadCuentasVenezolanas(): void {
    this.cuentaBancariaService.getCuentasVenezolanas().subscribe(
      (data: CuentaBancaria[]) => {
        this.cuentasBancarias = data;
      },
      error => {
        console.error('Error al obtener las cuentas bancarias venezolanas:', error);
      }
    );
  }

  openActualizarModal(cuenta: CuentaBancaria): void {
    const dialogRef = this.dialog.open(ActualizarCuentaBancariaComponent, {
      width: '600px',
      data: { cuentaBancaria: cuenta }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.loadCuentasVenezolanas();
      }
    });
  }

  mostrarMovimientosDeCuenta(cuenta: CuentaBancaria): void {
    this.router.navigate(['/operaciones/movimientos-venezolanos', cuenta.id]);
  }

  getCardClass(nombreBanco: string): string {
    switch (nombreBanco) {
      case 'Banco de Venezuela':
        return 'banco-venezuela';
      case 'BBVA':
      case 'Banesco':
        return 'bbva';
      case 'Banco Mercantil':
        return 'banco-mercantil';
      default:
        return 'default';
    }
  }
}
