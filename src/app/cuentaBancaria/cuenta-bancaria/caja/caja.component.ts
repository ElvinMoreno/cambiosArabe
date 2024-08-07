import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { CajaService } from '../../../services/caja.service';
import { CuentaBancaria } from '../../../interfaces/cuenta-bancaria';
import { Movimiento} from '../../../interfaces/movimiento';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-caja',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule],
  templateUrl: './caja.component.html',
  styleUrls: ['./caja.component.css']
})
export class CajaComponent implements OnInit {
  monto: number | null = null;
  movimientos: Movimiento[] = [];
  errorMessage: string | null = null;
  displayedColumns: string[] = ['hora', 'tipoMovimiento', 'monto', 'descripcion', 'entrada'];

  constructor(private cajaService: CajaService) { }

  ngOnInit(): void {
    this.cajaService.getCajaDatos()
      .pipe(
        catchError(error => {
          console.error('Error al obtener datos de la caja:', error);
          this.errorMessage = 'Ocurrió un error al obtener los datos de la caja. Por favor, inténtalo de nuevo.';
          return of(null);
        })
      )
      .subscribe(data => {
        if (data) {
          this.monto = data.monto;
        }
      });

    this.cajaService.getMovimientosCaja()
      .pipe(
        catchError(error => {
          console.error('Error al obtener movimientos de la caja:', error);
          this.errorMessage = 'Ocurrió un error al obtener los movimientos de la caja. Por favor, inténtalo de nuevo.';
          return of([]);
        })
      )
      .subscribe(data => {
        this.movimientos = data;
      });
  }
}
