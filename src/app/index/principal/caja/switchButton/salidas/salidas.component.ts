import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { AggSalidaComponent } from '../../../../formulario/agg-salida/agg-salida.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'salidas',
  standalone: true,
  imports: [MatButtonModule, MatTableModule,CommonModule,
    MatIconModule
  ],
  templateUrl: './salidas.component.html',
  styleUrl: './salidas.component.css'
})
export class SalidasComponent {
  ELEMENT_DATA = [
    { numero: 'Jon', cuenta: '123456', origen: 10000, monto: 10.5, descripcion: 1.2, detalles: 'Pago de servicio' },
    { numero: 'Alba', cuenta: '654321', origen: 20000, monto: 21.0, descripcion: 1.1, detalles: 'Pago de producto' }
  ];

  displayedColumns: string[] = ['nombreCliente', 'cuenta', 'transferenciaBolivares', 'conversion', 'tasa', 'detalles'];
  dataSource = this.ELEMENT_DATA;

  constructor(public dialog: MatDialog) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(AggSalidaComponent, {
      width: '600px'
    });

    dialogRef.componentInstance.confirmar.subscribe((data: any) => {
      // Lógica para manejar los datos de la nueva salida
      console.log(data);
    });

    dialogRef.componentInstance.cancelar.subscribe(() => {
      dialogRef.close();
    });
  }
}
