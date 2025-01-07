import { CommonModule } from '@angular/common';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-cuenta-venezolana',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    MatDialogModule,
    MovimientosTableComponent,
    MatProgressSpinnerModule // Importa el módulo aquí
  ],
  templateUrl: './cuenta-venezolana.component.html',
  styleUrls: ['./cuenta-venezolana.component.css']
})
export class CuentaVenezolanaComponent implements OnInit {
  cuentasBancarias: CuentaBancaria[] = [];
  movimientos: MovimientoDiaDTO[] = [];
  nombreCuentaBancaria: string = '';
  mostrandoMovimientos: boolean = false;
  movimientosCache: { [key: number]: MovimientoDiaDTO[] } = {}; // Cache para movimientos
  movimientosFiltrados: MovimientoDiaDTO[] = []; // Movimientos filtrados para la cuenta seleccionada
  cargandoMovimientos: boolean = false; // Indicador de carga

  @Input() cuentaId: number = 0;
  @Input() set movimientosG(value: MovimientoDiaDTO[]) {
    this.movimientos = value || [];
    this.filtrarMovimientos();
  }

  @Output() equivalenteEnPesosEmitter = new EventEmitter<number>();

  constructor(
    private cuentaBancariaService: CuentaBancariaService,
    private compraService: CompraService,
    private movimientoService: MovimientoService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadCuentasVenezolanas();

    if (this.cuentaId && this.movimientos.length > 0) {
      this.filtrarMovimientos();
    }
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

  filtrarMovimientos(): void {
    if (this.cuentaId) {
      this.movimientosFiltrados = this.movimientos.filter(
        movimiento => movimiento.id === this.cuentaId
      );
    } else {
      this.movimientosFiltrados = this.movimientos;
    }
    console.log('Movimientos filtrados:', this.movimientosFiltrados);
  }

  mostrarMovimientosDeCuenta(cuenta: CuentaBancaria): void {
    this.nombreCuentaBancaria = cuenta.nombreCuenta || '';
    this.cargandoMovimientos = true; // Mostrar indicador de carga

    // Verificar si los movimientos ya están en el cache
    if (this.movimientosCache[cuenta.id]) {
      this.movimientos = this.movimientosCache[cuenta.id];
      this.mostrandoMovimientos = true;
      this.cargandoMovimientos = false; // Ocultar indicador de carga
      console.log('Movimientos cargados desde el cache:', this.movimientos);
    } else {
      // Si no están en el cache, cargarlos desde el servicio
      this.movimientoService.getMovimientosStream(cuenta.id).subscribe({
        next: (movimiento: MovimientoDiaDTO) => {
          // Agregar cada movimiento al array mientras llegan
          if (!this.movimientosCache[cuenta.id]) {
            this.movimientosCache[cuenta.id] = []; // Inicializar si no existe en el caché
          }
      
          this.movimientosCache[cuenta.id].push(movimiento);
      
          // Ordenar los movimientos en tiempo real si es necesario
          this.movimientos = this.movimientosCache[cuenta.id].sort(
            (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
          );
      
          this.mostrandoMovimientos = true;
        },
        error: error => {
          console.error('Error al obtener los movimientos:', error);
          this.cargandoMovimientos = false; // Ocultar indicador en caso de error
        },
        complete: () => {
          this.cargandoMovimientos = false; // Ocultar indicador al finalizar
        }
      });
    }
  }

  regresarAListaDeCuentas(): void {
    this.mostrandoMovimientos = false;
    this.movimientosFiltrados = [];
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

  openCrearCuentaBancaria(): void {
    const dialogRef = this.dialog.open(CrearCuentaBancariaVComponent, { width: '600px' });
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
