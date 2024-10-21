import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MovimientoService } from '../../services/movimiento.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { CajaService } from '../../services/caja.service';
import { MatButtonModule } from '@angular/material/button';

interface DialogConfig {
  id: number
  data: any;
  title?: string;
  fields: { label: string; key: string; format?: string }[];
  showCloseButton?: boolean;
  closeButtonLabel?: string;
  callerComponent?: string;
}

@Component({
  selector: 'app-detalle-movimiento-comp-gen',
  standalone: true,
  providers: [provideNativeDateAdapter()
  ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,  // Proveedor para el adaptador de fecha
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './detalle-movimiento-comp-gen.component.html',
  styleUrls: ['./detalle-movimiento-comp-gen.component.css']
})
export class DetalleMovimientoCompGenComponent {
  title: string;
  fields: { label: string; key: string; format?: string }[];
  showCloseButton: boolean;
  closeButtonLabel: string;
  nuevaFecha: Date | null = null;
  today: Date;  // Propiedad para limitar la fecha máxima

  constructor(
    public dialogRef: MatDialogRef<DetalleMovimientoCompGenComponent>,
    @Inject(MAT_DIALOG_DATA) public config: DialogConfig,
    private movimientoService: MovimientoService,
    private cajaService: CajaService
  ) {
    this.title = config.title || 'Detalles';
    this.fields = config.fields;
    this.showCloseButton = config.showCloseButton !== false;
    this.closeButtonLabel = config.closeButtonLabel || 'Cerrar';
    this.today = new Date();  // Inicializa con la fecha de hoy
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

// Método para actualizar la fecha  // Método para actualizar la fecha
  actualizarFecha(): void {
    if (this.nuevaFecha) {
      const movimientoId = this.config.id;

      // Convertir la fecha a formato 'yyyy-MM-dd'
      const year = this.nuevaFecha.getFullYear();
      const month = (this.nuevaFecha.getMonth() + 1).toString().padStart(2, '0');
      const day = this.nuevaFecha.getDate().toString().padStart(2, '0');
      const nuevaFechaStr = `${year}-${month}-${day}`;

      // Crear el cuerpo del objeto para enviar en la solicitud
      const requestBody = {
        movimientoId: movimientoId.toString(), // Convertir a string
        nuevaFecha: nuevaFechaStr
      };

      // Verificar si el modal fue abierto por el componente 'caja'
      if (this.config.callerComponent === 'caja') {
        // Usar el método del CajaService para modificar la fecha
        this.cajaService.modificarFechaMovimiento(movimientoId, nuevaFechaStr).subscribe(
          response => {
            console.log(response);
            alert('Fecha actualizada correctamente.');
            this.dialogRef.close(); // Cierra el modal después de la actualización
          },
          error => {
            console.error('Error al actualizar la fecha usando CajaService:', error);
            alert('Error al actualizar la fecha. Inténtalo de nuevo.');
          }
        );
        console.log(movimientoId);
        console.log(nuevaFechaStr);
      } else {
        // Si no es 'caja', usar el MovimientoService
        this.movimientoService.modificarFechaMovimiento(requestBody).subscribe(
          response => {
            console.log('Fecha actualizada correctamente usando MovimientoService:', response);
            alert('Fecha actualizada correctamente.');
            this.dialogRef.close(); // Cierra el modal después de la actualización
          },
          error => {
            console.error('Error al actualizar la fecha usando MovimientoService:', error);
            alert('Error al actualizar la fecha. Inténtalo de nuevo.');
          }
        );
      }
    } else {
      alert('Por favor, selecciona una nueva fecha antes de actualizar.');
    }
  }



}
