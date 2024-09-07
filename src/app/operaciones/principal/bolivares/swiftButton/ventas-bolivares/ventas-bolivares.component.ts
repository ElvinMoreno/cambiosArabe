import { Component, OnInit, ViewChild } from '@angular/core';
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
import { TraerVenta } from '../../../../../interfaces/traer-venta';

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
    MatPaginatorModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './ventas-bolivares.component.html',
  styleUrls: ['./ventas-bolivares.component.css']
})
export class VentasBolivaresComponent implements OnInit {
  displayedColumns: string[] = ['cuentaCop', 'metodoPago', 'cliente', 'tasa', 'fecha', 'bolivares', 'pesos'];
  dataSource = new MatTableDataSource<VentaBs>(); // Usamos el mismo dataSource para ambas vistas
  dataCard = new MatTableDataSource<TraerVenta>()
  paginatedCards: TraerVenta[] = []; // Store the data for the current page
  isMobile = false;
  pageSize = 5;
  pageSizeOptions = [5, 10, 25];
  selectedDate: Date | null = null;
  currentPage = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;


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
        this.dataSource.paginator = this.paginator; // Asignar el paginador a la fuente de datos
      });
  }

    loadVentas(): void {
      this.ventaBsService.getAllVentasBs().subscribe(
        (data: VentaBs[]) => {
          this.dataSource.data = data;
          this.applyDateFilter();  // Aplicar el filtro de fecha si existe
        },
        (error) => {
          console.error('Error al cargar las ventas:', error);
        }
      );

      this.ventaBsService.getAllVentasBs2().subscribe(
        (data: TraerVenta[]) => {
          this.dataCard.data = data;
          this.updatePaginatedCards(); // Update the paginated data when data is loaded
        },
        (error) => {
          console.error('Error al cargar las ventas:', error);
        }
      );
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

  onPageChange(event: PageEvent) {
    this.dataSource.paginator = this.paginator;
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.updatePaginatedCards();
  }

  // Update paginatedCards to show only the items for the current page
  updatePaginatedCards(): void {
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedCards = this.dataCard.data.slice(start, end); // Slice the data for the current page
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(BancolombiaComponent, {
      width: '800px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      // Recargar las ventas después de cerrar el modal, independientemente del resultado
      this.loadVentas();
    });
  }

  onConfirmar(event: Crearventa): void {
    this.ventaBsService.saveVentaBs(event).subscribe(
      () => {
        this.loadVentas();  // Recargar ventas después de guardar la venta
      },
      (error) => {
        console.error('Error al guardar la venta:', error);
      }
    );
  }

}
