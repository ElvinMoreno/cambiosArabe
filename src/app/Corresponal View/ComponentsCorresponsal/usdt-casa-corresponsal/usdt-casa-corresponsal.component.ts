import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { ContentButtonTableComponent } from '../content-button-table/content-button-table.component';
import { DialogVentaComponent } from '../../Dialog Compenent/dialog-venta/dialog-venta.component';

@Component({
  selector: 'app-usdt-casa-corresponsal',
  standalone: true,
  imports: [
    MatButtonModule,
    CommonModule,
    ContentButtonTableComponent,
    MatDialogModule
  ],
  templateUrl: './usdt-casa-corresponsal.component.html',
  styleUrl: './usdt-casa-corresponsal.component.css'
})
export class UsdtCasaCorresponsalComponent implements OnInit {
  activeButton: string | null = null; // Para rastrear el botón seleccionado
  showTable: boolean = false; // Controla la visibilidad del componente con delay

  // Datos de demostración para Compras y Ventas
  comprasColumnas = [
    { key: 'producto', label: 'Producto' },
    { key: 'cantidad', label: 'Cantidad' },
    { key: 'precio', label: 'Precio' },
  ];
  comprasDatos = [
    { producto: 'Laptop', cantidad: 1, precio: '$1000' },
    { producto: 'Mouse', cantidad: 2, precio: '$50' },
  ];

  ventasColumnas = [
    { key: 'cliente', label: 'Cliente' },
    { key: 'producto', label: 'Producto' },
    { key: 'total', label: 'Total' },
  ];
  ventasDatos = [
    { cliente: 'Carlos', producto: 'Teclado', total: '$30' },
    { cliente: 'María', producto: 'Monitor', total: '$200' },
  ];

  botones = [{ label: 'Agregar', action: () => this.openDialog() }];
  fechaSeleccionada: Date | null = null;
  datos: any[] = []; // Ahora permite cualquier tipo de datos
  columnas = this.comprasColumnas; // Columnas activas
  // datos = this.comprasDatos; // Datos activos

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    // Inicializar con los datos de Ventas por defecto
    this.setActiveButton('ventas');
  }
  // Cambia el botón activo y muestra el componente después del delay
  setActiveButton(button: string): void {
    this.activeButton = button;
    this.showTable = false; // Ocultar la tabla mientras se aplica el delay

    // Asignar datos según el botón seleccionado
    if (button === 'compras') {
      this.columnas = this.comprasColumnas;
      this.datos = this.comprasDatos;
    } else if (button === 'ventas') {
      this.columnas = this.ventasColumnas;
      this.datos = this.ventasDatos;
    }

    // Mostrar la tabla con un retraso de 0.5s
    setTimeout(() => {
      this.showTable = true;
    }, 200);
  }
   // Método para abrir el diálogo
   openDialog(): void {
    this.dialog.open(DialogVentaComponent, {
      width: '400px', // Ancho del diálogo
      disableClose: false, // Permite cerrar el diálogo haciendo clic fuera de él
    });
  }
}
