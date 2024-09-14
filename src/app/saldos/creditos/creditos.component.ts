import { Component, OnInit } from '@angular/core';
import { ClientesCreditosComponent } from './clientes-creditos/clientes-creditos.component';
import { MatTabsModule } from '@angular/material/tabs';
import { ClienteService } from '../../services/clientes.service';
import { ProveedorService } from '../../services/proveedor.service'; // Importa el servicio de Proveedor
import { catchError, of } from 'rxjs';
import { ProveedorCreditoComponent } from './proveedor-credito/proveedor-credito.component';
import { RouterModule } from '@angular/router';  // Importa RouterModule


@Component({
  selector: 'app-creditos',
  standalone: true,
  imports: [ClientesCreditosComponent, MatTabsModule, ProveedorCreditoComponent, RouterModule],  // Agrega RouterModule
  templateUrl: './creditos.component.html',
  styleUrls: ['./creditos.component.css']
})
export class CreditosComponent implements OnInit {
  selectedTabIndex = 0;
  totalCreditos: number | null = null;
  totalDeudasProveedores: number | null = null; // Nueva variable para almacenar el total de deudas
  balanceDeudas: number | null = null; // Variable para almacenar la diferencia entre deudas y créditos

  constructor(private clienteService: ClienteService, private proveedorService: ProveedorService) {}

  ngOnInit() {
    this.cargarTotalCreditos();
    this.cargarTotalDeudasProveedores();
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
          return total + proveedor.creditosProveedor.reduce((sum, credito) => sum + (credito.montoRestante || 0), 0);
        }, 0);

        this.calcularBalanceDeudas();
      });
  }

  calcularBalanceDeudas() {
    if (this.totalCreditos !== null && this.totalDeudasProveedores !== null) {
      this.balanceDeudas = this.totalCreditos - this.totalDeudasProveedores;
    }
  }

  get totalCreditosLabel(): string {
    return this.totalCreditos !== null ? `$${this.totalCreditos.toFixed(2)}` : '$';
  }

  get totalDeudasProveedoresLabel(): string {
    return this.totalDeudasProveedores !== null ? `$${this.totalDeudasProveedores.toFixed(2)}` : '$';
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
      return this.balanceDeudas >= 0 ? 'color: green;' : 'color: red;';
    } else {
      return '';
    }
  }
}
