import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ListarCuentasColombianasComponent } from './listar-cuentas-colombianas/listar-cuentas-colombianas.component';
import { ListarMovimientosColombianasComponent } from './listar-movimientos-colombianas/listar-movimientos-colombianas.component';
import { CajaComponent } from './caja/caja.component';
import { CajaService } from '../../../services/caja.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-cuenta-colombiana',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    CommonModule,
    FlexLayoutModule,
    MatTabsModule,
    ListarCuentasColombianasComponent,
    ListarMovimientosColombianasComponent,
    CajaComponent // <- Asegúrate de importar MatTabsModule

  ],
  templateUrl: './cuenta-colombiana.component.html',
  styleUrls: ['./cuenta-colombiana.component.css']
})
export class CuentaColombianaComponent implements OnInit {
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
