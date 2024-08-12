import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';  // Asegúrate de importar CommonModule
import { MovimientoService } from '../../../../services/movimiento.service';
import { MovimientoDiaDTO } from '../../../../interfaces/MovimientoDiaDTO';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-listar-movimientos-colombianas',
  standalone: true,
  imports: [CommonModule],  // Incluye CommonModule aquí
  templateUrl: './listar-movimientos-colombianas.component.html',
  styleUrls: ['./listar-movimientos-colombianas.component.css']
})
export class ListarMovimientosColombianasComponent implements OnInit {
  movimientos: MovimientoDiaDTO[] = [];
  errorMessage: string | null = null;

  constructor(private movimientoService: MovimientoService) {}

  ngOnInit(): void {
    const cuentaBancariaId = 1;  // Aquí pones el ID de la cuenta colombiana que deseas consultar
    this.loadMovimientosColombianas(cuentaBancariaId);
  }

  loadMovimientosColombianas(cuentaBancariaId: number): void {
    this.movimientoService.getMovimientosColombianas(cuentaBancariaId)
      .pipe(
        catchError(error => {
          console.error('Error al obtener los movimientos de la cuenta colombiana:', error);
          this.errorMessage = 'Ocurrió un error al obtener los movimientos. Por favor, inténtalo de nuevo.';
          return of([]);
        })
      )
      .subscribe(data => {
        this.movimientos = data;
      });
  }
}
