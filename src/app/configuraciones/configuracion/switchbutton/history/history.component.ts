import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { HistorialModificaciones } from '../../../../interfaces/historial-notificaciones';
import { HistorialNotificacionesService } from '../../../../services/historial-notificaciones.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout'; // Importar el servicio BreakpointObserver
import { CommonModule } from '@angular/common';

@Component({
  selector: 'history',
  standalone: true,
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css'],
  imports: [MatPaginatorModule, MatTableModule, CommonModule]
})
export class HistoryComponent implements AfterViewInit {

  // Definir las columnas que se mostrarán
  displayedColumns: string[] = ['fecha', 'fechamodificacion', 'tipo', 'descripcion'];
  dataSource = new MatTableDataSource<HistorialModificaciones>();  // Fuente de datos

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  isMobileView: boolean = false;  // Nueva propiedad para rastrear si la vista es móvil

  constructor(
    private historialNotificacionesService: HistorialNotificacionesService,
    private breakpointObserver: BreakpointObserver  // Inyectar el servicio BreakpointObserver
  ) {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;

    // Detectar el tamaño de la pantalla
    this.breakpointObserver.observe([Breakpoints.Handset])
      .subscribe(result => {
        this.isMobileView = result.matches;  // Cambia el valor de isMobileView según el tamaño de la pantalla
      });

    // Obtener datos del historial
    this.historialNotificacionesService.getHistorialModificaciones().subscribe(
      (data: HistorialModificaciones[]) => {
        this.dataSource.data = data;  // Asigna los datos obtenidos
      },
      (error) => {
        console.error('Error al obtener el historial de modificaciones:', error);
      }
    );
  }

  // Método para mostrar el tipo completo o solo la primera letra según la vista
  getTipoDisplay(tipo: string): string {
    return this.isMobileView ? tipo.charAt(0) : tipo;
  }

  // Método para mostrar la fecha en diferentes formatos dependiendo de la vista
  getFechaDisplay(fecha: Date): string {
    return this.isMobileView ? new Date(fecha).toLocaleDateString('en-GB', { year: '2-digit', day: '2-digit', month: '2-digit' }) : new Date(fecha).toLocaleDateString('en-GB', { year: 'numeric', day: '2-digit', month: '2-digit' });
  }
}
