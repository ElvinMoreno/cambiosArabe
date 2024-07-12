import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { AggCompraComponent } from '../../../../formulario/agg-compra/agg-compra.component';



@Component({
  selector: 'compras-bolivares',
  standalone: true,
  imports: [MatButtonModule,MatTableModule,CommonModule, ],
  templateUrl: './compras-bolivares.component.html',
  styleUrl: './compras-bolivares.component.css'
})
export class ComprasBolivaresComponent {
  ELEMENT_DATA = [
    { nombreCliente: 'Juan Perez', cuenta: '123456', transferenciaBolivares: 10000, conversion: 10.5, tasa: 1.2, detalles: 'Pago de servicio' },
    { nombreCliente: 'Maria Gomez', cuenta: '654321', transferenciaBolivares: 20000, conversion: 21.0, tasa: 1.1, detalles: 'Pago de producto' }
  ];

  displayedColumns: string[] = ['nombreCliente', 'cuenta', 'transferenciaBolivares', 'conversion', 'tasa', 'detalles'];
  dataSource = this.ELEMENT_DATA;
  constructor(public dialog: MatDialog) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(AggCompraComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Compra confirmada:', result);
        // Aquí puedes manejar el resultado, como agregar la nueva compra a la tabla
      } else {
        console.log('Compra cancelada');
      }
    });
  }
}
