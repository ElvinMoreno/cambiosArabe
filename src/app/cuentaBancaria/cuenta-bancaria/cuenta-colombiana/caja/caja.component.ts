import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CajaService } from '../../../../services/caja.service';
import { MovimientoDiaDTO } from '../../../../interfaces/MovimientoDiaDTO';
import { catchError, EMPTY, of } from 'rxjs';
import { MovimientosTableComponent } from '../../../../shared/movimientos-table/movimientos-table.component'; // Importar el componente

@Component({
  selector: 'app-caja',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatDialogModule, MovimientosTableComponent], // Asegúrate de importar MovimientosTableComponent
  templateUrl: './caja.component.html',
  styleUrls: ['./caja.component.css']
})
export class CajaComponent implements OnInit {
  monto: number | null = null;
  movimientos: MovimientoDiaDTO[] = []; // Inicializado como un array vacío
  errorMessage: string | null = null;
  isMobile: boolean = false;

  constructor(private cajaService: CajaService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.checkScreenSize();
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
          return EMPTY; // Detener el flujo sin emitir valores
        })
      )
      .subscribe({
        next: (movimiento: MovimientoDiaDTO) => {
          // Agregar el movimiento recibido a la lista
          this.movimientos.push(movimiento);
    
          // Ordenar los movimientos por fecha en tiempo real
          if (this.movimientos.length > 1) {
            this.movimientos.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
          } // Forzar el cambio de referencia para que Angular detecte cambios
        },
      
      });
    
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth <= 768;
  }
}
