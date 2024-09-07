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
import { CuentaDestinatario } from '../../../../../interfaces/cuenta-destinatario';

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
  mobileDataSource = new MatTableDataSource<CuentaDestinatario>();
  originalData: VentaBs[] = []; // Variable para almacenar el conjunto de datos original
  isMobile = false;
  pageSize = 5;
  pageSizeOptions = [5, 10, 25];
  selectedDate: Date | null = null;

  @ViewChild('desktopPaginator', { static: true }) desktopPaginator!: MatPaginator;
  @ViewChild('mobilePaginator', { static: true }) mobilePaginator!: MatPaginator;

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
        } else {
          this.dataSource.paginator = this.desktopPaginator;
        }
      });
  }


  loadVentas(): void {
    this.ventaBsService.getAllVentasBs().subscribe(
      (data: VentaBs[]) => {
        this.originalData = data; // Almacena los datos originales
        this.dataSource.data = data;
        this.dataSource.paginator = this.desktopPaginator;

        // Transformar los datos para vista móvil centrada en CuentaDestinatario
        this.transformToMobileData(data);

        this.applyDateFilter();  // Aplicar el filtro inicial
      },
      (error) => {
        console.error('Error al cargar las ventas:', error);
      }
    );
  }

  transformToMobileData(data: VentaBs[]): void {
    const mobileData: CuentaDestinatario[] = [];
    data.forEach(venta => {
      venta.cuentasDestinatario!.forEach(cuenta => {
        mobileData.push({
          ventaBsId: venta.id, // Ajustar si se necesita
          nombreCuentaDestinatario: cuenta.nombreCuentaDestinatario,
          cedula: cuenta.cedula,
          numeroCuenta: cuenta.numeroCuenta,
          bancoId: cuenta.bancoId,
          bolivares: cuenta.bolivares
        });
      });
    });
    this.mobileDataSource.data = mobileData;
    this.mobileDataSource.paginator = this.mobilePaginator;
  }

  applyDateFilter(): void {
    if (this.selectedDate) {
      const selectedDateStr = this.formatDate(this.selectedDate); // Formato dd/MM/yyyy
      this.dataSource.data = this.originalData.filter(item => { // Filtra sobre los datos originales
        const itemDateStr = this.formatDate(new Date(item.fechaVenta));
        return itemDateStr === selectedDateStr;
      });
      this.updateMobileData();
    } else {
      this.dataSource.data = this.originalData; // Restablece los datos originales si no hay filtro
      this.updateMobileData();
    }
  }

  formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  clearDate(): void {
    this.selectedDate = null; // Limpiar la fecha seleccionada
    this.dataSource.data = this.originalData; // Restaurar los datos originales
    this.updateMobileData(); // Actualizar la vista para dispositivos móviles
  }

  updateMobileData() {
    if (this.isMobile) {
      const mobileData: CuentaDestinatario[] = [];
      this.dataSource.data.forEach((venta: VentaBs) => {
        venta.cuentasDestinatario!.forEach((cuenta: CuentaDestinatario) => {
          mobileData.push({
            ventaBsId: venta.id, // Suponiendo que VentaBs tiene un id
            nombreCuentaDestinatario: cuenta.nombreCuentaDestinatario,
            cedula: cuenta.cedula,
            numeroCuenta: cuenta.numeroCuenta,
            bancoId: cuenta.bancoId,
            bolivares: cuenta.bolivares
          });
        });
      });
      this.mobileDataSource.data = mobileData;
      this.mobileDataSource.paginator = this.mobilePaginator;
    }
  }

  onPageChange(event: PageEvent) {
    this.mobileDataSource.paginator = this.mobilePaginator;
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

  onConfirmar(event: Crearventa
  ) {
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
