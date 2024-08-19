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
  dataSource = new MatTableDataSource<VentaBs>();
  paginatedDataSource: VentaBs[] = [];
  isMobile = false;
  pageSize = 5;
  pageSizeOptions = [5, 10, 25];
  selectedDate: Date | null = null;

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
        if (this.isMobile) {
          this.updateMobileData();
        }
      });
  }

  loadVentas(): void {
    this.ventaBsService.getAllVentasBs().subscribe(
      (data: VentaBs[]) => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.applyDateFilter();  // Aplicar el filtro inicial
        this.updateMobileData();
      },
      (error) => {
        console.error('Error al cargar las ventas:', error);
      }
    );
  }

  applyDateFilter(): void {
    if (this.selectedDate) {
      const selectedDateStr = this.formatDate(this.selectedDate); // Formato dd/MM/yyyy
      this.dataSource.data = this.dataSource.data.filter(item => {
        const itemDateStr = this.formatDate(new Date(item.fechaVenta));
        return itemDateStr === selectedDateStr;
      });
      this.updateMobileData();
    } else {
      this.loadVentas(); // Si no hay fechas seleccionadas, carga todos los datos
    }
  }

  formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  updateMobileData() {
    if (this.isMobile) {
      this.paginatedDataSource = this.dataSource.data.slice(0, this.pageSize);
    }
  }

  onPageChange(event: PageEvent) {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.paginatedDataSource = this.dataSource.data.slice(startIndex, endIndex);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(BancolombiaComponent, {
      width: '800px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadVentas();
      if (result) {
        this.onConfirmar(result);
      }
    });
  }

  onConfirmar(event: VentaBs) {
    this.ventaBsService.saveVentaBs(event).subscribe(
      () => {
        this.loadVentas();
      },
      (error) => {
        console.error('Error al guardar la venta:', error);
      }
    );
  }
}
