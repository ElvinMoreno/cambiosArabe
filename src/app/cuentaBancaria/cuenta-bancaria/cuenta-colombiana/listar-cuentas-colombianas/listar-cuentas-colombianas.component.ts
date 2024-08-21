import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CuentaBancariaService } from '../../../../services/cuenta-bancaria.service';
import { CuentaBancaria } from '../../../../interfaces/cuenta-bancaria';
import { MatDialog } from '@angular/material/dialog';
import { MovimientosTableComponent } from '../../../../shared/movimientos-table/movimientos-table.component';
import { MovimientoService } from '../../../../services/movimiento.service'; // Importa el servicio de movimientos
import { MovimientoDiaDTO } from '../../../../interfaces/MovimientoDiaDTO';
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
    FlexLayoutModule,
    MovimientosTableComponent
  ],
  templateUrl: './listar-cuentas-colombianas.component.html',
  styleUrls: ['./listar-cuentas-colombianas.component.css']
})
export class ListarCuentasColombianasComponent implements OnInit {
  cuentasBancarias: CuentaBancaria[] = [];
  movimientos: MovimientoDiaDTO[] = []; // Movimientos de la cuenta seleccionada
  nombreCuentaBancaria: string = ''; // Nombre de la cuenta seleccionada
  mostrandoMovimientos: boolean = false; // Para alternar entre vistas

  constructor(
    private cuentaBancariaService: CuentaBancariaService, 
    private movimientoService: MovimientoService, // Importa el servicio de movimientos
    public dialog: MatDialog) {}

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

  mostrarMovimientosDeCuenta(cuenta: CuentaBancaria): void {
    this.nombreCuentaBancaria = cuenta.nombreCuenta || ''; // Asigna una cadena vacía si es null
    this.movimientoService.getMovimientos(cuenta.id).subscribe(
      (data: MovimientoDiaDTO[]) => {
        this.movimientos = data.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
        this.mostrandoMovimientos = true;
      },
      (error) => {
        console.error('Error al obtener los movimientos:', error);
      }
    );
  }


  regresarAListaDeCuentas(): void {
    this.mostrandoMovimientos = false;
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
}
