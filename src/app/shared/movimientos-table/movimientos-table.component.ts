import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as XLSX from 'xlsx'; // Importa XLSX para manejar archivos Excel
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MovimientoDiaDTO } from '../../interfaces/MovimientoDiaDTO';
import { DetalleMovimientoCompGenComponent } from '../detalle-movimiento-comp-gen/detalle-movimiento-comp-gen.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-movimientos-table',
  standalone: true,
  imports: [CommonModule, MatDialogModule, FormsModule, MatIconModule],
  templateUrl: './movimientos-table.component.html',
  styleUrls: ['./movimientos-table.component.css'],
})
export class MovimientosTableComponent implements OnChanges {
  @Input() movimientos: MovimientoDiaDTO[] = [];
  movimientosFiltrados: MovimientoDiaDTO[] = [];
  filterDate: string | null = null;

  constructor(public dialog: MatDialog) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['movimientos'] && changes['movimientos'].currentValue) {
      this.movimientos.sort(
        (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
      );
      this.movimientosFiltrados = [...this.movimientos];
    }
  }

  filtrarPorDia(): void {
    if (this.filterDate) {
      const selectedDate = new Date(this.filterDate);
      this.movimientosFiltrados = this.movimientos.filter((movimiento) => {
        const movimientoDate = new Date(movimiento.fecha);
        return (
          movimientoDate.getDate() === selectedDate.getDate() &&
          movimientoDate.getMonth() === selectedDate.getMonth() &&
          movimientoDate.getFullYear() === selectedDate.getFullYear()
        );
      });
    } else {
      this.movimientosFiltrados = [...this.movimientos];
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
          { label: 'Entrada', key: 'entrada' },
        ],
        showCloseButton: true,
        closeButtonLabel: 'Cerrar',
      },
    });
  }

  exportarExcel(): void {
    const data = this.movimientosFiltrados.map((mov) => ({
      Fecha: this.isToday(mov.fecha)
        ? new Date(mov.fecha).toLocaleTimeString()
        : new Date(mov.fecha).toLocaleDateString(),
      Monto: mov.monto.toFixed(2), // Redondear Monto a 2 decimales
      TipoMovimiento: mov.tipoMovimiento,
      SaldoActual: mov.saldoActual.toFixed(2), // Redondear SaldoActual a 2 decimales
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data'],
    };

    // Generar el archivo Excel
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    // Crear el archivo Blob
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    // Crear un enlace de descarga
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'movimientos.xlsx';
    anchor.click();

    // Liberar la URL del objeto después de la descarga
    window.URL.revokeObjectURL(url);
  }

}
