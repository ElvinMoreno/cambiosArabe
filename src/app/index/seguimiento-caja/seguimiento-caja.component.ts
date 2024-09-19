import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';  
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms'; // <-- Importar FormsModule para usar ngModel
import { CuentaBancariaService } from '../../services/cuenta-bancaria.service';
import { MovimientoService } from '../../services/movimiento.service'; // Añadido para movimientos
import { catchError, of } from 'rxjs';
import { MovimientoDiaDTO } from '../../interfaces/MovimientoDiaDTO'; 
import { ChangeDetectorRef } from '@angular/core'; // Importar para manejar la detección de cambios

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
    FormsModule // <-- Añadir FormsModule al array de imports
  ],
  templateUrl: './seguimiento-caja.component.html',
  styleUrls: ['./seguimiento-caja.component.css']
})
export class SeguimientoCajaComponent implements OnInit {

  seguimientoCaja: { fecha: string, colombianas: number, venezolanas: number, utilidad: number }[] = [];
  mesSeleccionado: string = ''; // Mes seleccionado

  displayedColumns: string[] = ['fecha', 'colombianas', 'venezolanas', 'utilidad'];

  constructor(
    private movimientoService: MovimientoService, 
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Obtener el mes y año actual en formato 'YYYY-MM'
    const fechaActual = new Date();
    const mesActual = fechaActual.toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit' });
    this.mesSeleccionado = mesActual;

    // Llamar al método para cargar los datos del mes actual
    this.cargarDatos();
  }

  onMesSeleccionado(event: any) {
    this.mesSeleccionado = event.target.value;
    this.cargarDatos();  // Vuelve a cargar los datos cuando cambia el mes
  }

  cargarDatos() {
    this.seguimientoCaja = [];

    if (!this.mesSeleccionado) {
      console.log("No hay mes seleccionado.");
      return;
    }

    const [anio, mes] = this.mesSeleccionado.split('-').map(Number);
    const diasDelMes = this.generarDiasDelMes(anio, mes);

    // Obtener movimientos venezolanos y colombianos y actualizar la tabla
    this.movimientoService.getMovimientosVenezolanas()
      .pipe(catchError(error => {
        console.error('Error al obtener movimientos venezolanos:', error);
        return of([]);
      }))
      .subscribe(movimientosVenezolanos => {
        const montosVenezolanosPorDia = this.sumarSaldosPorDia(movimientosVenezolanos);
        console.log("Montos venezolanos por día:", montosVenezolanosPorDia);

        this.movimientoService.getMovimientosColombianas()
          .pipe(catchError(error => {
            console.error('Error al obtener movimientos colombianos:', error);
            return of([]);
          }))
          .subscribe(movimientosColombianos => {
            const montosColombianosPorDia = this.sumarSaldosPorDia(movimientosColombianos);
            console.log("Montos colombianos por día:", montosColombianosPorDia);

            // Actualizar la tabla con los movimientos
            this.actualizarTabla(diasDelMes, montosColombianosPorDia, montosVenezolanosPorDia);
          });
      });
  }

  // Función que genera todos los días del mes seleccionado
  generarDiasDelMes(anio: number, mes: number): string[] {
    const diasEnMes = new Date(anio, mes, 0).getDate();
    const diasDelMes: string[] = [];
    for (let dia = 1; dia <= diasEnMes; dia++) {
      const fecha = new Date(anio, mes - 1, dia).toLocaleDateString('en-CA'); 
      diasDelMes.push(fecha);
    }
    return diasDelMes;
  }

  // Función que agrupa los movimientos por fecha y obtiene el saldo del último movimiento de cada cuenta
  sumarSaldosPorDia(movimientos: MovimientoDiaDTO[]): { [fecha: string]: number } {
    const saldosPorDia: { [fecha: string]: number } = {};

    movimientos.forEach(movimiento => {
      const fecha = new Date(movimiento.fecha).toLocaleDateString('en-CA'); 
      if (!saldosPorDia[fecha]) {
        saldosPorDia[fecha] = 0;
      }
      // Obtener el saldo actual del último movimiento de ese día
      saldosPorDia[fecha] += movimiento.saldoActual;
    });

    return saldosPorDia;
  }

  // Actualizar la tabla con los saldos del último movimiento por día
  actualizarTabla(diasDelMes: string[], montosColombianosPorDia: { [fecha: string]: number }, montosVenezolanosPorDia: { [fecha: string]: number }) {
    diasDelMes.forEach(fecha => {
      const colombianas = montosColombianosPorDia[fecha] || 0; 
      const venezolanas = montosVenezolanosPorDia[fecha] || 0;
      const utilidad = colombianas + venezolanas;

      this.seguimientoCaja.push({
        fecha,
        colombianas,
        venezolanas,
        utilidad
      });
    });

    this.cdr.detectChanges(); 
    this.seguimientoCaja = [...this.seguimientoCaja]; 
  }
}
