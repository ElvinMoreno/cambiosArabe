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
  selectedTabIndex = 0;  // Por defecto, el tab de Pesos
  totalPesos: number | null = null;

  constructor(private route: ActivatedRoute) {}  // Inyecta ActivatedRoute

  ngOnInit() {
    // Obtén el parámetro 'tab' de la ruta y úsalo para establecer el índice del tab
    this.route.queryParams.subscribe(params => {
      const tabIndex = params['tab'] ? Number(params['tab']) : 0;
      this.selectedTabIndex = tabIndex;
    });
  }

  actualizarTotalPesos(totalPesos: number) {
    this.totalPesos = totalPesos;
  }

  get totalPesosLabel(): string {
    return this.totalPesos !== null ? `$${Math.trunc(this.totalPesos/1000)}` : '$';
  }
}