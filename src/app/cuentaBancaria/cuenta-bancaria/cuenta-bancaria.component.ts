import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { CuentaColombianaComponent } from './cuenta-colombiana/cuenta-colombiana.component';
import { CuentaVenezolanaComponent } from './cuenta-venezolana/cuenta-venezolana.component';
import { CajaComponent } from './cuenta-colombiana/caja/caja.component';
import { ClientesCreditosComponent } from '../../saldos/creditos/clientes-creditos/clientes-creditos.component';
import { CreditosComponent } from '../../saldos/creditos/creditos.component';
import { ActivatedRoute } from '@angular/router';
import { CompraService } from '../../services/compra.service';
import { ClienteService } from '../../services/clientes.service';
import { ProveedorService } from '../../services/proveedor.service';
import { catchError, of } from 'rxjs';
import { MovimientoService } from '../../services/movimiento.service';
import { MovimientoDiaDTO } from '../../interfaces/MovimientoDiaDTO';

@Component({
  selector: 'app-cuenta-bancaria',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatTabsModule,
    CuentaColombianaComponent,
    CuentaVenezolanaComponent, // Importar el componente
    CajaComponent,
    ClientesCreditosComponent,
    CreditosComponent,
    CommonModule,
    MatButtonModule,
    MatTabsModule
  ],
  templateUrl: './cuenta-bancaria.component.html',
  styleUrls: ['./cuenta-bancaria.component.css'],
})
export class CuentaBancariaComponent implements OnInit {
  selectedTabIndex = 0;
  cuentaId = 9; // Cuenta activa
  movimientosCuenta9: MovimientoDiaDTO[] = [];
  totalPesos: number | null = null;
  equivalenteEnPesos: number | null = null;
  totalCreditos: number | null = null;
  totalDeudasProveedores: number | null = null;
  balanceDeudas: number | null = null;
  movimientos: MovimientoDiaDTO[] = [];
  mostrandoMovimientos: boolean = false;
  nombreCuentaBancaria: string = '';

  constructor(
    private route: ActivatedRoute,
    private movimientoService: MovimientoService,
    private compraService: CompraService,
    private clienteService: ClienteService,
    private proveedorService: ProveedorService,
  ) {}


  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const tabIndex = params['tab'] ? Number(params['tab']) : 0;
      this.selectedTabIndex = tabIndex;
    });

    this.cargarTotalCreditos();
    this.cargarTotalDeudasProveedores();
    this.mostrarMovimientosDeCuenta(this.cuentaId);
    console.log(this.mostrarMovimientosDeCuenta(1)) ;
     // Cargar los movimientos de la cuenta con id === 9
     this.cargarMovimientosCuenta9();

  }

  cargarMovimientosCuenta9(): void {
    this.movimientosCuenta9 = [];
    this.movimientoService.getMovimientosStream(this.cuentaId).subscribe({
      next: movimiento => {
        this.movimientosCuenta9.push(movimiento);
        this.movimientosCuenta9.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
      },
      error: error => {
        console.error('Error al obtener los movimientos de la cuenta 9:', error);
      },
    });
  }



  actualizarEquivalenteEnPesos(equivalente: number) {
    this.equivalenteEnPesos = equivalente;
  }

  actualizarTotalPesos(totalPesos: number) {
    this.totalPesos = totalPesos;
  }

  cargarTotalCreditos() {
    this.clienteService.getAllClientes()
      .pipe(
        catchError(error => {
          console.error('Error al obtener los créditos:', error);
          return of([]);  // Manejo del error
        })
      )
      .subscribe(clientes => {
        // Calcula el total de créditos sumando los créditos permitidos
        this.totalCreditos = clientes
          .filter(cliente => cliente.permitirCredito)
          .reduce((total, cliente) => total + cliente.creditos.reduce((sum, credito) => sum + credito.precio, 0), 0);

        this.calcularBalanceDeudas();
      });
  }


  cargarTotalDeudasProveedores() {
    this.proveedorService.getAllProveedores()
      .pipe(
        catchError(error => {
          console.error('Error al obtener las deudas de los proveedores:', error);
          return of([]);  // Manejo del error
        })
      )
      .subscribe(proveedores => {
        // Suma las deudas de los proveedores directamente del campo total
        this.totalDeudasProveedores = proveedores.reduce((total, proveedor) => {
          return total + (proveedor.total || 0);  // Usamos el campo `total` del proveedor
        }, 0);

        this.calcularBalanceDeudas();
      });
  }

  mostrarMovimientosDeCuenta(cuentaId: number): void {
    this.nombreCuentaBancaria = `Cuenta con ID ${cuentaId}`;
    this.movimientos = []; // Reinicia la lista de movimientos antes de cargar nuevos
    this.mostrandoMovimientos = false; 
    this.movimientoService.getMovimientosStream(cuentaId).subscribe({
      next: (movimiento: MovimientoDiaDTO) => {
        // Agregar cada movimiento recibido al array
        this.movimientos.push(movimiento);
  
        // Ordenar los movimientos en tiempo real
        this.movimientos.sort(
          (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
        );
      },
      error: (error) => {
        console.error('Error al obtener los movimientos:', error);
      },
      complete: () => {
        // Mostrar movimientos cuando todos se han recibido
        this.mostrandoMovimientos = true;
      }
    });
  }



  calcularBalanceDeudas() {

    if (this.totalCreditos !== null && this.totalDeudasProveedores !== null) {
      this.balanceDeudas = this.totalCreditos - this.totalDeudasProveedores;
      console.log('Balance Deudas:', this.balanceDeudas);
    }
  }



  get totalPesosLabel(): string {
    return this.totalPesos !== null ? `$${Math.trunc(this.totalPesos / 1000)}` : '$';
  }

  get equivalenteEnPesosLabel(): string {
    return this.equivalenteEnPesos !== null ? `$${(this.equivalenteEnPesos / 1000).toFixed(2)}` : '$';
  }

  get balanceLabel(): string {
    if (this.equivalenteEnPesos !== null && this.totalPesos !== null) {
      const totalBalance = (this.equivalenteEnPesos / 1000) + (this.totalPesos / 1000);
      return `$${totalBalance.toFixed(2)}`;
    } else {
      return '$';
    }
  }

  get balanceDeudasLabel(): string {
    if (this.balanceDeudas !== null) {
      return `$${this.balanceDeudas.toFixed(2)}`;
    } else {
      return '$';
    }
  }

  get balanceDeudasStyle(): string {
    if (this.balanceDeudas !== null) {
      return this.balanceDeudas >= 0 ? 'green' : 'red';  // Verde si es positivo, rojo si es negativo
    } else {
      return '';  // Retorna cadena vacía si el valor es nulo
    }
  }

}

