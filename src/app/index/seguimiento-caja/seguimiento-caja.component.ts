import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';  
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MovimientoService } from '../../services/movimiento.service';
import { ProveedorService } from '../../services/proveedor.service';
import { catchError, of } from 'rxjs';
import { MovimientoDiaDTO } from '../../interfaces/MovimientoDiaDTO';
import { Deuda } from '../../interfaces/deuda';  // Importar la interfaz Deuda
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-seguimiento-caja',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    FormsModule
  ],
  templateUrl: './seguimiento-caja.component.html',
  styleUrls: ['./seguimiento-caja.component.css']
})
export class SeguimientoCajaComponent implements OnInit {

  seguimientoCaja: { fecha: string, colombianas: number, venezolanas: number, clientes: number, utilidad: number }[] = [];
  mesSeleccionado: string = ''; // Mes seleccionado
  displayedColumns: string[] = ['fecha', 'colombianas', 'venezolanas', 'clientes', 'utilidad'];

  constructor(
    private movimientoService: MovimientoService, 
    private proveedorService: ProveedorService,  
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const fechaActual = new Date();
    const mesActual = fechaActual.toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit' });
    this.mesSeleccionado = mesActual;

    this.cargarDatos();
  }

  onMesSeleccionado(event: any) {
    this.mesSeleccionado = event.target.value;
    this.cargarDatos();
  }

  cargarDatos() {
    this.seguimientoCaja = [];

    if (!this.mesSeleccionado) {
      console.log("No hay mes seleccionado.");
      return;
    }

    const [anio, mes] = this.mesSeleccionado.split('-').map(Number);
    const diasDelMes = this.generarDiasDelMes(anio, mes);

    this.movimientoService.getMovimientosVenezolanas()
      .pipe(catchError(error => {
        console.error('Error al obtener movimientos venezolanos:', error);
        return of([]);
      }))
      .subscribe(movimientosVenezolanos => {
        const ultimoSaldoVenezolanoPorDia = this.obtenerUltimoSaldoPorDia(movimientosVenezolanos);

        this.movimientoService.getMovimientosColombianas()
          .pipe(catchError(error => {
            console.error('Error al obtener movimientos colombianos:', error);
            return of([]);
          }))
          .subscribe(movimientosColombianos => {
            const ultimoSaldoColombianoPorDia = this.obtenerUltimoSaldoPorDia(movimientosColombianos);

            // Obtener las deudas de los clientes a través de la interfaz Deuda
            this.proveedorService.getCreditosByProveedorId(1) 
              .pipe(catchError(error => {
                console.error('Error al obtener las deudas de clientes:', error);
                return of([]);
              }))
              .subscribe(deudasClientes => {
                const ultimoSaldoClientesPorDia = this.obtenerUltimoSaldoClientesPorDia(deudasClientes);

                this.actualizarTabla(diasDelMes, ultimoSaldoColombianoPorDia, ultimoSaldoVenezolanoPorDia, ultimoSaldoClientesPorDia);
              });
          });
      });
  }

  // Generar los días del mes seleccionado
  generarDiasDelMes(anio: number, mes: number): string[] {
    const diasEnMes = new Date(anio, mes, 0).getDate();
    const diasDelMes: string[] = [];
    for (let dia = 1; dia <= diasEnMes; dia++) {
      const fecha = new Date(anio, mes - 1, dia).toLocaleDateString('en-CA'); 
      diasDelMes.push(fecha);
    }
    return diasDelMes;
  }

  // Obtener el último saldo de cada día para los movimientos
  // Obtener el último saldo de cada día para los movimientos, ordenando por fecha y hora
obtenerUltimoSaldoPorDia(movimientos: MovimientoDiaDTO[]): { [fecha: string]: number } {
  const saldosPorDia: { [fecha: string]: MovimientoDiaDTO[] } = {};

  movimientos.forEach(movimiento => {
      const fecha = new Date(movimiento.fecha).toLocaleDateString('en-CA'); 
      if (!saldosPorDia[fecha]) {
          saldosPorDia[fecha] = [];
      }
      saldosPorDia[fecha].push(movimiento); // Agrupar los movimientos por fecha
  });

  // Tomar solo el último saldo del día
  const ultimoSaldoPorDia: { [fecha: string]: number } = {};
  Object.keys(saldosPorDia).forEach(fecha => {
      const movimientosDelDia = saldosPorDia[fecha];
      movimientosDelDia.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()); // Ordenar por fecha/hora
      ultimoSaldoPorDia[fecha] = movimientosDelDia[0].saldoActual; // Tomar el último saldo del día
  });

  return ultimoSaldoPorDia;
}


 // Obtener el último saldo de cada día para los clientes (Deuda), ordenando por fecha y hora
obtenerUltimoSaldoClientesPorDia(deudas: Deuda[]): { [fecha: string]: number } {
  const saldosPorDia: { [fecha: string]: Deuda[] } = {};

  deudas.forEach(deuda => {
      const fecha = new Date(deuda.fecha).toLocaleDateString('en-CA');
      if (!saldosPorDia[fecha]) {
          saldosPorDia[fecha] = [];
      }
      saldosPorDia[fecha].push(deuda); // Agrupar las deudas por fecha
  });

  // Tomar solo el último saldo del día
  const ultimoSaldoPorDia: { [fecha: string]: number } = {};
  Object.keys(saldosPorDia).forEach(fecha => {
      const deudasDelDia = saldosPorDia[fecha];
      deudasDelDia.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()); // Ordenar por fecha/hora
      ultimoSaldoPorDia[fecha] = deudasDelDia[0].saldoActual; // Tomar el último saldo del día
  });

  return ultimoSaldoPorDia;
}

  // Actualizar la tabla con los datos
  actualizarTabla(diasDelMes: string[], ultimoSaldoColombianoPorDia: { [fecha: string]: number }, ultimoSaldoVenezolanoPorDia: { [fecha: string]: number }, ultimoSaldoClientesPorDia: { [fecha: string]: number }) {
    diasDelMes.forEach(fecha => {
      const colombianas = ultimoSaldoColombianoPorDia[fecha] || 0; 
      const venezolanas = ultimoSaldoVenezolanoPorDia[fecha] || 0;
      const clientes = ultimoSaldoClientesPorDia[fecha] || 0;
      const utilidad = colombianas + venezolanas;

      this.seguimientoCaja.push({
        fecha,
        colombianas,
        venezolanas,
        clientes,
        utilidad
      });
    });

    this.cdr.detectChanges(); 
    this.seguimientoCaja = [...this.seguimientoCaja]; 
  }
}
