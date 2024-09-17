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
import { catchError, of } from 'rxjs';

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
  seguimientoCaja: { fecha: string, creditosTotal: number, colombianas: number, venezolanas: number, utilidad: number }[] = [];
  totalCreditos: number = 0;
  totalColombianas: number = 0;
  totalVenezolanas: number = 0;

  // Variable para almacenar el mes seleccionado
  mesSeleccionado: string = '';

  // Definir las columnas de la tabla
  displayedColumns: string[] = ['fecha', 'creditosTotal', 'colombianas', 'venezolanas', 'utilidad'];

  constructor(
    private clienteService: ClienteService,
    private proveedorService: ProveedorService,
    private cuentaBancariaService: CuentaBancariaService
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
      return;
    }

    // Obtener la suma de créditos (deudas)
    this.clienteService.getAllClientes()
      .pipe(catchError(error => of([])))
      .subscribe(clientes => {
        this.totalCreditos = clientes
          .filter(cliente => cliente.permitirCredito)
          .reduce((total, cliente) => total + cliente.creditos.reduce((sum, credito) => sum + credito.precio, 0), 0);
        this.actualizarTabla();
      });

    // Obtener la suma de cuentas colombianas
    this.cuentaBancariaService.getCuentasColombianas()
      .pipe(catchError(error => of([])))
      .subscribe(cuentas => {
        this.totalColombianas = cuentas.reduce((total, cuenta) => total + (cuenta.monto || 0), 0);
        this.actualizarTabla();
      });

    // Obtener la suma de cuentas venezolanas (en pesos)
    this.cuentaBancariaService.getCuentasVenezolanas()
      .pipe(catchError(error => of([])))
      .subscribe(cuentas => {
        this.totalVenezolanas = cuentas.reduce((total, cuenta) => total + (cuenta.monto || 0), 0);
        this.actualizarTabla();
      });
  }

  actualizarTabla() {
    const fechaActual = new Date().toLocaleDateString(); 
    const utilidad = this.totalCreditos + this.totalColombianas + this.totalVenezolanas;

    // Filtrar por mes antes de mostrar los datos
    if (this.mesSeleccionado) {
      const mes = this.mesSeleccionado.split('-')[1]; // Extraer el mes de la fecha seleccionada

      // Crear un registro para el seguimiento
      this.seguimientoCaja.push({
        fecha: fechaActual,
        creditosTotal: this.totalCreditos,
        colombianas: this.totalColombianas,
        venezolanas: this.totalVenezolanas,
        utilidad: utilidad
      });

      // Actualizar la tabla con el filtro del mes seleccionado
      this.seguimientoCaja = this.seguimientoCaja.filter(item => {
        const itemMes = new Date(item.fecha).getMonth() + 1; // Obtener el mes del item
        return itemMes === parseInt(mes, 10);
      });
    }
  }
}
