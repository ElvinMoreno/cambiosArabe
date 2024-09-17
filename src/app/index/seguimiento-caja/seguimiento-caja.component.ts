import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';  
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { ClienteService } from '../../services/clientes.service';
import { ProveedorService } from '../../services/proveedor.service';
import { CuentaBancariaService } from '../../services/cuenta-bancaria.service';
import { MovimientoService } from '../../services/movimiento.service'; // Añadido para movimientos
import { catchError, of } from 'rxjs';
import { MovimientoDiaDTO } from '../../interfaces/MovimientoDiaDTO'; // Asegúrate de tener esta interfaz para movimientos

@Component({
  selector: 'app-seguimiento-caja',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule
  ],
  templateUrl: './seguimiento-caja.component.html',
  styleUrls: ['./seguimiento-caja.component.css']
})
export class SeguimientoCajaComponent implements OnInit {

  // Variables para almacenar los totales por día
  seguimientoCaja: { fecha: string, colombianas: number, venezolanas: number, utilidad: number }[] = [];
  totalColombianas: number = 0;
  totalVenezolanas: number = 0;

  // Variable para almacenar el mes seleccionado
  mesSeleccionado: string = '';

  // Definir las columnas de la tabla
  displayedColumns: string[] = ['fecha', 'colombianas', 'venezolanas', 'utilidad'];

  constructor(
    private clienteService: ClienteService,
    private proveedorService: ProveedorService,
    private cuentaBancariaService: CuentaBancariaService,
    private movimientoService: MovimientoService // Añadido para usar el servicio de movimientos
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  // Método que se ejecuta cuando el mes cambia
  onMesSeleccionado(event: any) {
    this.mesSeleccionado = event.target.value;
    this.cargarDatos();  // Vuelve a cargar los datos cuando cambia el mes
  }

  cargarDatos() {
    // Limpiar el seguimiento anterior antes de cargar nuevos datos
    this.seguimientoCaja = [];
  
    if (!this.mesSeleccionado) {
      console.log("No hay mes seleccionado.");
      return;
    }
  
    // Obtener movimientos colombianas y sumarlos por día
    this.movimientoService.getMovimientosColombianas()
      .pipe(catchError(error => {
        console.error('Error al obtener movimientos colombianos:', error);
        return of([]);
      }))
      .subscribe(movimientos => {
        console.log("Movimientos colombianos recibidos:", movimientos);
        const montosPorDia = this.sumarMontosPorDia(movimientos);
        console.log("Montos por día:", montosPorDia);
        this.actualizarTabla(montosPorDia);
      });
  
    // Obtener la suma de cuentas venezolanas (en pesos)
    this.cuentaBancariaService.getCuentasVenezolanas()
      .pipe(catchError(error => {
        console.error('Error al obtener cuentas venezolanas:', error);
        return of([]);
      }))
      .subscribe(cuentas => {
        this.totalVenezolanas = cuentas.reduce((total, cuenta) => total + (cuenta.monto || 0), 0);
        console.log("Total venezolanas:", this.totalVenezolanas);
        this.actualizarTabla();
      });
  }
  

  // Función que agrupa los movimientos por fecha y suma los montos
  sumarMontosPorDia(movimientos: MovimientoDiaDTO[]): { [fecha: string]: number } {
    const montosPorDia: { [fecha: string]: number } = {};

    movimientos.forEach(movimiento => {
      const fecha = new Date(movimiento.fecha).toLocaleDateString(); // Agrupar por fecha
      if (!montosPorDia[fecha]) {
        montosPorDia[fecha] = 0;
      }
      montosPorDia[fecha] += movimiento.monto; // Sumar el monto del día
    });

    return montosPorDia;
  }

  // Actualizar la tabla con los montos sumados por día
  actualizarTabla(montosPorDia: { [fecha: string]: number } = {}) {
    Object.entries(montosPorDia).forEach(([fecha, colombianas]) => {
      const utilidad = colombianas + this.totalVenezolanas;
      const mesFecha = new Date(fecha).getMonth() + 1; // obtener mes de la fecha
      const mesSeleccionado = parseInt(this.mesSeleccionado.split('-')[1]);
  
      if (mesFecha === mesSeleccionado) {
        this.seguimientoCaja.push({
          fecha,
          colombianas,
          venezolanas: this.totalVenezolanas,
          utilidad
        });
      }
    });
  }
  
}
