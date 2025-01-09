import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { BancolombiaComponent } from '../../../../formulario/bancolombia/bancolombia.component';
import { VentaBs } from '../../../../../interfaces/venta-bs';
import { VentaBsService } from '../../../../../services/venta-bs.service';
import { Crearventa } from '../../../../../interfaces/crearventa';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { provideNativeDateAdapter } from '@angular/material/core';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { VentaAllDTO } from '../../../../../interfaces/VentaAllDTO';

@Component({
  selector: 'ventas-bolivares',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatCardModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    FormsModule,
    MatPaginatorModule
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './ventas-bolivares.component.html',
  styleUrls: ['./ventas-bolivares.component.css']
})
export class VentasBolivaresComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['cuentaCop', 'metodoPago', 'tasa', 'fecha', 'bolivares', 'pesos'];
  mobileDisplayedColumns: string[] = ['cuentaCop', 'tasa', 'fecha', 'pesos']; // Solo columnas para móvil
  dataSource = new MatTableDataSource<VentaAllDTO>();
  isMobile = false;
  pageSize = 5;
  pageSizeOptions = [5, 10, 25];
  selectedDate: Date | null = null;
  resultsLength = 0;
  isLoadingResults = true;
  private dateFilterSubject = new Subject<Date | null>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    public dialog: MatDialog,
    private ventaBsService: VentaBsService,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this.checkScreenSize();
    this.loadVentas();
    this.dateFilterSubject
      .pipe(
        debounceTime(300), // Reducir llamadas excesivas
        distinctUntilChanged() // Solo emitir cambios reales
      )
      .subscribe(date => this.applyDateFilter(date));
  }

  checkScreenSize() {
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
      this.isMobile = result.matches;
      this.displayedColumns = this.isMobile ? this.mobileDisplayedColumns : ['cuentaCop', 'metodoPago', 'tasa', 'fecha', 'bolivares', 'pesos'];
    });
  }

  loadVentas(): void {
    this.isLoadingResults = true;
    this.ventaBsService.getAllVentasBs().subscribe({
      next: (venta: VentaAllDTO) => {
        // Agregar cada venta al dataSource
        this.dataSource.data = [...this.dataSource.data, venta];
        this.resultsLength = this.dataSource.data.length;
      },
      error: error => {
        console.error('Error al cargar las ventas:', error);
      },
      complete: () => {
        // Ordenar los datos por fecha en el bloque 'complete'
        this.dataSource.data.sort((a, b) => {
          const dateA = new Date(a.fecha).getTime();
          const dateB = new Date(b.fecha).getTime();
          return dateB - dateA; // Orden descendente
        });
  
        // Configurar paginador y ordenación
        this.isLoadingResults = false;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyDateFilter(date: Date | null): void {
    if (date) {
      const selectedDateStr = this.formatDate(date);
      this.dataSource.data = this.dataSource.data.filter(item => {
        const itemDateStr = this.formatDate(new Date(item.fecha));
        return itemDateStr === selectedDateStr;
      });
    } else {
      this.dataSource.data = [...this.dataSource.data]; // Restaurar datos sin filtro
    }
    this.dataSource.paginator = this.paginator;
  }

  formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  clearDate(): void {
    this.selectedDate = null;
    this.dateFilterSubject.next(null);
  }

  onDateChange(date: Date | null): void {
    this.dateFilterSubject.next(date);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(BancolombiaComponent, {
      width: '800px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(() => {
      this.loadVentas();
    });
  }

  onConfirmar(event: Crearventa): void {
    this.ventaBsService.saveVentaBs(event).subscribe({
      next: () => {
        this.loadVentas();
      },
      error: error => {
        console.error('Error al guardar la venta:', error);
      }
    });
  }
}
