import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { CuentaBancariaService } from '../../../services/cuenta-bancaria.service';
import { CompraService } from '../../../services/compra.service';
import { MovimientoService } from '../../../services/movimiento.service';
import { CuentaBancaria } from '../../../interfaces/cuenta-bancaria';
import { MovimientoDiaDTO } from '../../../interfaces/MovimientoDiaDTO';
import { CrearCuentaBancariaVComponent } from '../crear-cuenta-bancaria-v/crear-cuenta-bancaria-v.component';
import { ActualizarCuentaBancariaComponent } from '../../../shared/actualizar-cuenta-bancaria/actualizar-cuenta-bancaria.component';
import { MovimientosTableComponent } from '../../../shared/movimientos-table/movimientos-table.component';

@Component({
  selector: 'app-cuenta-venezolana',
  standalone: true,
  templateUrl: './cuenta-venezolana.component.html',
  styleUrls: ['./cuenta-venezolana.component.css'],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MovimientosTableComponent, // Importar la tabla de movimientos
  ],
})
export class CuentaVenezolanaComponent implements OnInit {
  cuentasBancarias: CuentaBancaria[] = [];
  movimientos: MovimientoDiaDTO[] = [];
  movimientosFiltrados: MovimientoDiaDTO[] = [];
  movimientosCache: { [key: number]: MovimientoDiaDTO[] } = {};
  nombreCuentaBancaria: string = '';
  mostrandoMovimientos: boolean = false;
  cargandoMovimientos: boolean = false;
  
  @Input() movimientosG: MovimientoDiaDTO[] = [];
  @Input() cuentaId: number = 0;
  @Output() equivalenteEnPesosEmitter = new EventEmitter<number>();

  constructor(
    private cuentaBancariaService: CuentaBancariaService,
    private compraService: CompraService,
    private movimientoService: MovimientoService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadCuentasVenezolanas();
  }

  loadCuentasVenezolanas(): void {
    this.cuentaBancariaService.getCuentasVenezolanas().subscribe({
      next: (data: CuentaBancaria[]) => {
        this.cuentasBancarias = data;
      },
      error: error => {
        console.error('Error al obtener las cuentas bancarias venezolanas:', error);
      }
    });
  }

  mostrarMovimientosDeCuenta(cuenta: CuentaBancaria): void {
    this.nombreCuentaBancaria = cuenta.nombreCuenta || '';

    if (this.movimientosCache[cuenta.id]) {
      this.movimientos = this.movimientosCache[cuenta.id];
      this.mostrandoMovimientos = true;
      return;
    }

    this.cargandoMovimientos = true;
    this.movimientos = [];

    this.movimientoService.getMovimientosStream(cuenta.id).subscribe({
      next: (movimiento: MovimientoDiaDTO) => {
        this.movimientos.push(movimiento);
        this.movimientosCache[cuenta.id] = [...this.movimientos].sort(
          (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
        );
      },
      error: error => {
        console.error('Error al obtener los movimientos:', error);
        this.cargandoMovimientos = false;
      },
      complete: () => {
        this.mostrandoMovimientos = true;
        this.cargandoMovimientos = false;
      }
    });
  }

  regresarAListaDeCuentas(): void {
    this.mostrandoMovimientos = false;
    this.movimientos = [];
  }

  calcularEquivalenteEnPesos(cuentaBancariaBsId: number): void {
    this.compraService.calcularEquivalenteEnPesos(cuentaBancariaBsId).subscribe({
      next: equivalente => {
        this.equivalenteEnPesosEmitter.emit(equivalente);
      },
      error: error => {
        console.error('Error al calcular el equivalente en pesos:', error);
      }
    });
  }

  // Método para abrir el diálogo de actualización
  openActualizarModal(cuenta: CuentaBancaria): void {
    const dialogRef = this.dialog.open(ActualizarCuentaBancariaComponent, {
      width: '600px',
      data: { cuentaBancaria: cuenta },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCuentasVenezolanas(); // Recargar la lista de cuentas al cerrar el diálogo
      }
    });
  }

  openCrearCuentaBancaria(): void {
    const dialogRef = this.dialog.open(CrearCuentaBancariaVComponent, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCuentasVenezolanas(); // Recargar las cuentas después de crear una nueva
      }
    });
  }

  // Método para asignar clases CSS según el banco
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
