import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { AggEntradaComponent } from '../../../../formulario/agg-entrada/agg-entrada.component';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'entradas',
  standalone: true,
  imports: [MatButtonModule, MatTableModule,CommonModule,
    MatIconModule
  ],
  templateUrl: './entradas.component.html',
  styleUrl: './entradas.component.css'
})
export class EntradasComponent {
  ELEMENT_DATA = [
    { numero: 'Juan Perez', cuenta: '123456', origen: 10000, monto: 10.5, descripcion: 1.2, detalles: 'Pago de servicio' },
    { numero: 'Maria Gomez', cuenta: '654321', origen: 20000, monto: 21.0, descripcion: 1.1, detalles: 'Pago de producto' }
  ];

  displayedColumns: string[] = ['nombreCliente', 'cuenta', 'transferenciaBolivares', 'conversion', 'tasa', 'detalles'];
  dataSource = this.ELEMENT_DATA;

  constructor(public dialog: MatDialog) {}

  openDialog(): void {
  const dialogRef = this.dialog.open<AggEntradaComponent>(AggEntradaComponent, {
    width: '600px'
  });

  // dialogRef.componentInstance.confirmar.subscribe((data: any) => {
  //   // Lógica para manejar los datos de la nueva entrada
  //   console.log(data);
  // });

  dialogRef.componentInstance.cancelar.subscribe(() => {
    dialogRef.close();
  });
}
}
