import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CajaService } from '../../../../services/caja.service';
import { MovimientoDiaDTO } from '../../../../interfaces/MovimientoDiaDTO';
import { catchError, of } from 'rxjs';
import { DetalleMovimientoCompGenComponent } from '../../../../shared/detalle-movimiento-comp-gen/detalle-movimiento-comp-gen.component';

@Component({
  selector: 'app-caja',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatDialogModule],
  templateUrl: './caja.component.html',
  styleUrls: ['./caja.component.css']
})
export class CajaComponent implements OnInit {
  monto: number | null = null;
  movimientos: MovimientoDiaDTO[] = []; // Inicializado como un array vacío
  errorMessage: string | null = null;
  isMobile: boolean = false;

  constructor(private cajaService: CajaService, public dialog: MatDialog) { }

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
          return of([]);
        })
      )
      .subscribe(data => {
        // Ordenar los movimientos por fecha, mostrando los más recientes primero
        this.movimientos = data.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
      });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth <= 768;
  }

  isToday(dateString: string | Date): boolean {
    const date = new Date(dateString);
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }

  openDialog(movimiento: MovimientoDiaDTO): void {
    this.dialog.open(DetalleMovimientoCompGenComponent, {
      width: '400px',
      data: {
        title: 'Detalles del Movimiento',
        data: movimiento,
        fields: [
          { label: 'Fecha', key: 'fecha', format: 'date' },
          { label: 'Tipo de Movimiento', key: 'tipoMovimiento' },
          { label: 'Monto', key: 'monto', format: 'currency' },
          { label: 'Descripción', key: 'descripcion' },
          { label: 'Entrada', key: 'entrada' }
        ],
        showCloseButton: true,
        closeButtonLabel: 'Cerrar'
      }
    });
  }
}
