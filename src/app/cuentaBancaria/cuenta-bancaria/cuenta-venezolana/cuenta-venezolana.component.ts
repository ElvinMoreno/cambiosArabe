import { CommonModule } from '@angular/common';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CuentaBancariaService } from '../../../services/cuenta-bancaria.service';
import { CompraService } from '../../../services/compra.service';
import { CuentaBancaria } from '../../../interfaces/cuenta-bancaria';
import { MovimientoService } from '../../../services/movimiento.service';
import { MovimientoDiaDTO } from '../../../interfaces/MovimientoDiaDTO';
import { MovimientosTableComponent } from '../../../shared/movimientos-table/movimientos-table.component';
import { CrearCuentaBancariaVComponent } from '../crear-cuenta-bancaria-v/crear-cuenta-bancaria-v.component';
import { ActualizarCuentaBancariaComponent } from '../../../shared/actualizar-cuenta-bancaria/actualizar-cuenta-bancaria.component';

@Component({
  selector: 'app-cuenta-venezolana',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    MatDialogModule,
    MovimientosTableComponent
  ],
  templateUrl: './cuenta-venezolana.component.html',
  styleUrls: ['./cuenta-venezolana.component.css']
})
export class CuentaVenezolanaComponent implements OnInit {
  cuentasBancarias: CuentaBancaria[] = [];
  movimientos: MovimientoDiaDTO[] = [];
  nombreCuentaBancaria: string = ''; // Inicializado como una cadena vacía
  mostrandoMovimientos: boolean = false;
  @Output() equivalenteEnPesosEmitter = new EventEmitter<number>();

  constructor(
    private cuentaBancariaService: CuentaBancariaService,
    private compraService: CompraService,
    private movimientoService: MovimientoService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadCuentasVenezolanas();

    this.cuentaBancariaService.getCuentasVenezolanas().subscribe(
      (data: CuentaBancaria[]) => {
        if (data.length > 0) {
          const cuentaId = data[0].id; // Usando la primera cuenta bancaria como ejemplo
          this.calcularEquivalenteEnPesos(cuentaId);
        }
      },
      error => {
        console.error('Error al obtener las cuentas bancarias venezolanas:', error);
      }
    );
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

  calcularEquivalenteEnPesos(cuentaBancariaBsId: number): void {
    this.compraService.calcularEquivalenteEnPesos(cuentaBancariaBsId).subscribe(
      (equivalente: number) => {
        console.log('Equivalente en pesos recibido:', equivalente);
        this.equivalenteEnPesosEmitter.emit(equivalente);
      },
      error => {
        console.error('Error al calcular el equivalente en pesos:', error);
      }
    );
  }

  mostrarMovimientosDeCuenta(cuenta: CuentaBancaria): void {
    this.nombreCuentaBancaria = cuenta.nombreCuenta || '';
    this.movimientoService.getMovimientos(cuenta.id).subscribe(
      (data: MovimientoDiaDTO[]) => {
        this.movimientos = data.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
        this.mostrandoMovimientos = true;
        console.log(data);
      },
      error => {
        console.error('Error al obtener los movimientos:', error);
      }
    );
  }

  regresarAListaDeCuentas(): void {
    this.mostrandoMovimientos = false;
  }

  openCrearCuentaBancaria(): void {
    const dialogRef = this.dialog.open(CrearCuentaBancariaVComponent, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCuentasVenezolanas();
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
        this.loadCuentasVenezolanas();
      }
    });
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
