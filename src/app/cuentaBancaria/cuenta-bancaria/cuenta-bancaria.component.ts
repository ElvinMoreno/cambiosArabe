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

  constructor(
    private route: ActivatedRoute,
    private compraService: CompraService,
    private clienteService: ClienteService,
    private proveedorService: ProveedorService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const tabIndex = params['tab'] ? Number(params['tab']) : 0;
      this.selectedTabIndex = tabIndex;
    });

    this.cargarTotalCreditos();
    this.cargarTotalDeudasProveedores();
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
          return of([]);
        })
      )
      .subscribe(clientes => {
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
          return of([]);
        })
      )
      .subscribe(proveedores => {
        this.totalDeudasProveedores = proveedores.reduce((total, proveedor) => {
          return total + proveedor.creditosProveedor.reduce((sum, credito) => sum + (credito.saldoActual || 0), 0);
        }, 0);

        this.calcularBalanceDeudas();
      });
  }

  calcularBalanceDeudas() {
    if (this.totalCreditos !== null && this.totalDeudasProveedores !== null) {
      this.balanceDeudas = this.totalCreditos - this.totalDeudasProveedores;
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
      return this.balanceDeudas >= 0 ? 'green' : 'red';
    } else {
      return '';
    }
  }
}
