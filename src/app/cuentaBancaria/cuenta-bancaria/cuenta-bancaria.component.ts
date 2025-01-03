import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { CuentaColombianaComponent } from './cuenta-colombiana/cuenta-colombiana.component';
import { CuentaVenezolanaComponent } from './cuenta-venezolana/cuenta-venezolana.component';
import { CajaComponent } from './cuenta-colombiana/caja/caja.component';
import { ClientesCreditosComponent } from "../../saldos/creditos/clientes-creditos/clientes-creditos.component";
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
    CuentaVenezolanaComponent,
    CajaComponent,
    ClientesCreditosComponent,
    CreditosComponent
  ],
  templateUrl: './cuenta-bancaria.component.html',
  styleUrls: ['./cuenta-bancaria.component.css']
})
export class CuentaBancariaComponent implements OnInit {
  selectedTabIndex = 0;
  totalPesos: number | null = null;
  equivalenteEnPesos: number | null = null;
  totalCreditos: number | null = null;
  totalDeudasProveedores: number | null = null;
  balanceDeudas: number | null = null;
  movimientos: MovimientoDiaDTO[] = [];
  mostrandoMovimientos: boolean = false;
  nombreCuentaBancaria: string = '';
  cuentaId: number = 9; // Especificar el ID de la cuenta activa
  movimientosCuenta9: MovimientoDiaDTO[] = []; // Variable para almacenar los movimientos de la cuenta con id === 9

  constructor(
    private route: ActivatedRoute,
    private compraService: CompraService,
    private clienteService: ClienteService,
    private proveedorService: ProveedorService,
    private movimientoService: MovimientoService
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
  cargarMovimientosCuenta9() {
    this.movimientoService.getMovimientos(9).subscribe(
      (data: MovimientoDiaDTO[]) => {
        this.movimientosCuenta9 = data.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
        console.log('Movimientos de cuenta 9 cargados:', this.movimientosCuenta9);
      },
      error => {
        console.error('Error al obtener los movimientos de la cuenta 9:', error);
      }
    );
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

        console.log('Total Créditos Calculado:', this.totalCreditos);
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

        console.log('Total Deudas Proveedores Calculado:', this.totalDeudasProveedores);
        this.calcularBalanceDeudas();
      });
  }

  mostrarMovimientosDeCuenta(cuentaId: number): void {
    this.nombreCuentaBancaria = `Cuenta con ID ${cuentaId}`;
    this.movimientoService.getMovimientos(cuentaId).subscribe(
      (data: MovimientoDiaDTO[]) => {
        this.movimientos = data.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
        this.mostrandoMovimientos = true;
        console.log('Movimientos cargados:', data);
      },
      error => {
        console.error('Error al obtener los movimientos:', error);
      }
    );
  }



  calcularBalanceDeudas() {
    console.log('Total Créditos:', this.totalCreditos);
    console.log('Total Deudas Proveedores:', this.totalDeudasProveedores);

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
