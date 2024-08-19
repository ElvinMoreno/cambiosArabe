import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CuentaBancariaService } from '../../../../services/cuenta-bancaria.service';
import { CuentaBancaria } from '../../../../interfaces/cuenta-bancaria';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CrearCuentaBancariaComponent } from '../../crear-cuenta-bancaria/crear-cuenta-bancaria.component';
import { ActualizarCuentaBancariaComponent } from '../../actualizar-cuenta-bancaria/actualizar-cuenta-bancaria.component';

@Component({
  selector: 'app-listar-cuentas-colombianas',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    FlexLayoutModule
  ],
  templateUrl: './listar-cuentas-colombianas.component.html',
  styleUrls: ['./listar-cuentas-colombianas.component.css']
})
export class ListarCuentasColombianasComponent implements OnInit {
  cuentasBancarias: CuentaBancaria[] = [];

  constructor(
    private cuentaBancariaService: CuentaBancariaService, 
    public dialog: MatDialog,
    private router: Router) {}

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

  openCrearCuentaBancaria(): void {
    const dialogRef = this.dialog.open(CrearCuentaBancariaComponent, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCuentasColombianas();  // Recargar la lista después de crear una cuenta
      }
    });
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

  mostrarMovimientosDeCuenta(cuenta: CuentaBancaria): void {
    this.router.navigate(['/operaciones/movimientos-venezolanos', cuenta.id], { queryParams: { esColombiana: true } });
}


}
