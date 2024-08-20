import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MovimientoDiaDTO } from '../../interfaces/MovimientoDiaDTO';
import { DetalleMovimientoCompGenComponent } from '../detalle-movimiento-comp-gen/detalle-movimiento-comp-gen.component';

@Component({
  selector: 'app-movimientos-table',
  standalone: true,
  imports: [CommonModule, MatDialogModule], // Asegúrate de importar MatDialogModule
  templateUrl: './movimientos-table.component.html',
  styleUrls: ['./movimientos-table.component.css'],
})
export class MovimientosTableComponent implements OnChanges {
  @Input() movimientos: MovimientoDiaDTO[] = [];

  constructor(public dialog: MatDialog) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['movimientos'] && changes['movimientos'].currentValue) {
      this.movimientos.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
    }
  }

  isToday(dateString: string): boolean {
    const date = new Date(dateString);
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
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
