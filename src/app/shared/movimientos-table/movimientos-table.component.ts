import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as XLSX from 'xlsx'; // Importa XLSX para manejar archivos Excel
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MovimientoDiaDTO } from '../../interfaces/MovimientoDiaDTO';
import { DetalleMovimientoCompGenComponent } from '../detalle-movimiento-comp-gen/detalle-movimiento-comp-gen.component';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-movimientos-table',
  standalone: true,
  imports: [CommonModule, MatDialogModule,
    FormsModule, MatIconModule, MatPaginatorModule],
  templateUrl: './movimientos-table.component.html',
  styleUrls: ['./movimientos-table.component.css'],
})
export class MovimientosTableComponent implements OnChanges {
  @Input() movimientos: MovimientoDiaDTO[] = [];
  @Input() fromCaja: boolean = false;  // Nuevo input para recibir el valor que indica si fue llamado por CajaComponent
  @Input() fromVenezolana: boolean = false; // Recibe el valor si es llamado desde cuenta venezolana
  movimientosFiltrados: MovimientoDiaDTO[] = [];
  paginatedMovimientos: MovimientoDiaDTO[] = []; // Movimientos que se mostrarán por página
  filterDate: string | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator; // Referencia al paginator
  pageSize = 5; // Tamaño de la página
  pageIndex = 0; // Índice actual de la página

  constructor(public dialog: MatDialog) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['movimientos'] && changes['movimientos'].currentValue) {
      this.movimientosFiltrados = [...this.movimientos];
      this.actualizarPaginacion(); // Actualizar paginación
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
    this.actualizarPaginacion(); // Actualizar paginación después de filtrar
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
        id: movimiento.id,
        data: movimiento,
        // Validación para saber si fue llamado desde 'caja', 'venezolana', o algún otro componente
        callerComponent: this.fromCaja ? 'caja' : (this.fromVenezolana ? 'venezolana' : 'otro'),
        fields: [
          { label: 'Fecha', key: 'fecha', format: 'date' },
          { label: 'Tipo de Movimiento', key: 'tipoMovimiento' },
          { label: 'Monto', key: 'monto', format: 'currency' },
          { label: 'Descripción', key: 'descripcion' },
          ...(movimiento.descripcion === 'Venta BS' ? [
            { label: 'Cliente', key: 'nombreClienteFinal' },
            { label: 'Tasa', key: 'tasaVenta' },
            { label: 'Bolivares Vendidos', key: 'bolivaresVendidos', format: 'currency' }
          ] : [])
        ],
        showCloseButton: true,
        closeButtonLabel: 'Cerrar',
      },
    });
  }


  actualizarPaginacion(): void {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedMovimientos = this.movimientosFiltrados.slice(startIndex, endIndex);
  }

  handlePageEvent(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.actualizarPaginacion(); // Actualizar movimientos por página
  }
  exportarExcel(): void {
    const data = this.movimientosFiltrados.map((mov) => ({
      Fecha: this.isToday(mov.fecha)
        ? new Date(mov.fecha) // Mantener como objeto Date para la exportación
        : new Date(mov.fecha), // Convertir a Date
      Monto: mov.descripcion === 'Compra BS' ? Math.abs(mov.monto) : -Math.abs(mov.monto), // Asigna + para 'Compra Bs' y - para el resto
      TipoMovimiento: mov.tipoMovimiento,
      SaldoActual: parseFloat(mov.saldoActual.toFixed(2)), // Redondear sin convertir a string
      Descripcion: mov.descripcion, // Agregar la columna de descripción
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data, {
      cellDates: true, // Opción para asegurar que las celdas se traten como fechas
      dateNF: 'yyyy-mm-dd', // Formato de fecha deseado
    });
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data'],
    };

    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'movimientos.xlsx';
    anchor.click();

    window.URL.revokeObjectURL(url);
  }





}
