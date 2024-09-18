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
    private movimientoService: MovimientoService, // Añadido para usar el servicio de movimientos
    private cdr: ChangeDetectorRef // Añadido para detectar cambios manualmente
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

    const [anio, mes] = this.mesSeleccionado.split('-').map(Number); // Obtener año y mes
    const diasDelMes = this.generarDiasDelMes(anio, mes); // Generar todos los días del mes seleccionado
    console.log("Días del mes seleccionado:", diasDelMes);
  
    // Obtener movimientos colombianas y sumarlos por día
    this.movimientoService.getMovimientosColombianas()
      .pipe(catchError(error => {
        console.error('Error al obtener movimientos colombianos:', error);
        return of([]);
      }))
      .subscribe(movimientos => {
        console.log("Movimientos colombianos recibidos:", movimientos);
        const montosPorDia = this.sumarMontosPorDia(movimientos);
        console.log("Montos por día calculados:", montosPorDia);

        // Obtener la suma de cuentas venezolanas (en pesos)
        this.cuentaBancariaService.getCuentasVenezolanas()
          .pipe(catchError(error => {
            console.error('Error al obtener cuentas venezolanas:', error);
            return of([]);
          }))
          .subscribe(cuentas => {
            this.totalVenezolanas = cuentas.reduce((total, cuenta) => total + (cuenta.monto || 0), 0);
            console.log("Total venezolanas:", this.totalVenezolanas);

            // Actualizar la tabla
            this.actualizarTabla(diasDelMes, montosPorDia);
          });
      });
  }

  // Función que genera todos los días del mes seleccionado
  generarDiasDelMes(anio: number, mes: number): string[] {
    const diasEnMes = new Date(anio, mes, 0).getDate(); // Obtener el número de días en el mes
    const diasDelMes: string[] = [];

    for (let dia = 1; dia <= diasEnMes; dia++) {
      const fecha = new Date(anio, mes - 1, dia).toLocaleDateString('en-CA'); // Formato yyyy-mm-dd
      diasDelMes.push(fecha);
    }

    return diasDelMes;
  }

  // Función que agrupa los movimientos por fecha y suma los montos
  sumarMontosPorDia(movimientos: MovimientoDiaDTO[]): { [fecha: string]: number } {
    const montosPorDia: { [fecha: string]: number } = {};

    movimientos.forEach(movimiento => {
      const fecha = new Date(movimiento.fecha).toLocaleDateString('en-CA'); // Asegúrate de usar el mismo formato
      if (!montosPorDia[fecha]) {
        montosPorDia[fecha] = 0;
      }
      montosPorDia[fecha] += movimiento.monto; // Sumar el monto del día
    });

    return montosPorDia;
  }

  // Actualizar la tabla con los montos sumados por día
  actualizarTabla(diasDelMes: string[], montosPorDia: { [fecha: string]: number }) {
    diasDelMes.forEach(fecha => {
      const colombianas = montosPorDia[fecha] || 0; // Si no hay montos, poner 0
      const utilidad = colombianas + this.totalVenezolanas;

      this.seguimientoCaja.push({
        fecha,
        colombianas,
        venezolanas: this.totalVenezolanas,
        utilidad
      });
    });

    // Forzar la detección de cambios manualmente
    this.cdr.detectChanges(); 

    // Otra forma de asegurarse de que Angular detecta los cambios es creando un nuevo array
    this.seguimientoCaja = [...this.seguimientoCaja]; // Forzar la actualización creando una nueva referencia
  }
  
}
