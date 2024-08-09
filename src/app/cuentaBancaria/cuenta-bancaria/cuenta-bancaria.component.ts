import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { CuentaColombianaComponent } from './cuenta-colombiana/cuenta-colombiana.component';
import { CuentaVenezolanaComponent } from './cuenta-venezolana/cuenta-venezolana.component';
import { CajaComponent } from './cuenta-colombiana/caja/caja.component';
import { CajaService } from '../../services/caja.service'; // Importar el servicio
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
    CajaComponent
  ],
  templateUrl: './cuenta-bancaria.component.html',
  styleUrls: ['./cuenta-bancaria.component.css']
})
export class CuentaBancariaComponent implements OnInit {
  selectedTabIndex = 0;  // Índice de la pestaña seleccionada
  montoCaja: number | null = null;

  constructor(private cajaService: CajaService) {}

  ngOnInit() {
    this.cajaService.getCajaDatos()
      .pipe(
        catchError(error => {
          console.error('Error al obtener datos de la caja:', error);
          return of(null);
        })
      )
      .subscribe(data => {
        if (data) {
          this.montoCaja = data.monto;
        }
      });
  }

  get cajaLabel(): string {
    return this.montoCaja !== null ? `$${this.montoCaja}` : '$';
  }
}
