import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovimientoService } from '../../../../services/movimiento.service';
import { MovimientoDiaDTO } from '../../../../interfaces/MovimientoDiaDTO';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-listar-movimientos-colombianas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listar-movimientos-colombianas.component.html',
  styleUrls: ['./listar-movimientos-colombianas.component.css']
})
export class ListarMovimientosColombianasComponent implements OnInit {
  movimientos: MovimientoDiaDTO[] = [];
  errorMessage: string | null = null;

  constructor(private movimientoService: MovimientoService) {}

  ngOnInit(): void {
    this.loadMovimientosColombianas();
  }

  loadMovimientosColombianas(): void {
    this.movimientoService.getMovimientosColombianas()
      .pipe(
        catchError(error => {
          console.error('Error al obtener los movimientos de las cuentas colombianas:', error);
          this.errorMessage = 'Ocurrió un error al obtener los movimientos. Por favor, inténtalo de nuevo.';
          return of([]);
        })
      )
      .subscribe(data => {
        this.movimientos = data;
      });
  }
}
