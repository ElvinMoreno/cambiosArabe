import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';

import { BancolombiaComponent } from '../../../../formulario/bancolombia/bancolombia.component';
import { VentaBs } from '../../../../../interfaces/venta-bs';
import { VentaBsService } from '../../../../../services/venta-bs.service';
import { Crearventa } from '../../../../../interfaces/crearventa';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { merge, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';

@Component({
  selector: 'ventas-bolivares',
  standalone: true,
  imports: [
    MatButtonModule,
    MatTableModule,
    CommonModule,
    MatDialogModule,
    MatIconModule,
    MatCardModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    FormsModule, MatPaginatorModule
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './ventas-bolivares.component.html',
  styleUrls: ['./ventas-bolivares.component.css']
})
export class VentasBolivaresComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['cuentaCop', 'metodoPago', 'tasa', 'fecha', 'bolivares', 'pesos'];
  mobileDisplayedColumns: string[] = ['cuentaCop', 'tasa', 'fecha', 'pesos']; // Solo columnas para móvil
  dataSource = new MatTableDataSource<VentaBs>(); // Datos para la tabla
  isMobile = false;
  pageSize = 5;
  pageSizeOptions = [5, 10, 25];
  selectedDate: Date | null = null;
  currentPage = 0;

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    public dialog: MatDialog,
    private ventaBsService: VentaBsService,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this.loadVentas();
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.breakpointObserver.observe([Breakpoints.Handset])
      .subscribe(result => {
        this.isMobile = result.matches;
        // Asignar las columnas en función de si está en móvil o no
        this.displayedColumns = this.isMobile ? this.mobileDisplayedColumns : ['cuentaCop', 'metodoPago', 'tasa', 'fecha', 'bolivares', 'pesos'];
        this.dataSource.paginator = this.paginator; // Asignar el paginador a la fuente de datos
      });
  }

  loadVentas(): void {
    this.ventaBsService.getAllVentasBs().subscribe(
      (data: VentaBs[]) => {
        this.dataSource.data = data;
        this.applyDateFilter(); // Aplicar el filtro de fecha si existe
      },
      (error) => {
        console.error('Error al cargar las ventas:', error);
      }
    );
  }

  ngAfterViewInit(): void {
    if (this.sort) {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }
  }
  // Función para manejar la ordenación
  sortData(sort: Sort) {
    const data = this.dataSource.data.slice();
    if (!sort.active || sort.direction === '') {
      this.dataSource.data = data;
      return;
    }

    this.dataSource.data = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'fecha':
          return compare(a.fechaVenta, b.fechaVenta, isAsc);
        default:
          return 0;
      }
    });
  }


  applyDateFilter(): void {
    if (this.selectedDate) {
      const selectedDateStr = this.formatDate(this.selectedDate);
      this.dataSource.data = this.dataSource.data.filter(item => {
        const itemDateStr = this.formatDate(new Date(item.fechaVenta));
        return itemDateStr === selectedDateStr;
      });
    }
    this.dataSource.paginator = this.paginator; // Actualizar la paginación
  }

  formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  clearDate(): void {
    this.selectedDate = null;
    this.loadVentas(); // Recargar las ventas al limpiar la fecha
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(BancolombiaComponent, {
      width: '800px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(() => {
      this.loadVentas(); // Recargar las ventas después de cerrar el modal
    });
  }

  onConfirmar(event: Crearventa): void {
    this.ventaBsService.saveVentaBs(event).subscribe(
      () => {
        this.loadVentas(); // Recargar ventas después de guardar la venta
      },
      (error) => {
        console.error('Error al guardar la venta:', error);
      }
    );
  }
}

function compare(a: Date | string, b: Date | string, isAsc: boolean) {
  return (new Date(a) < new Date(b) ? -1 : 1) * (isAsc ? 1 : -1);
}
