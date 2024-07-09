import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'salidas',
  standalone: true,
  imports: [MatButtonModule, MatTableModule,CommonModule],
  templateUrl: './salidas.component.html',
  styleUrl: './salidas.component.css'
})
export class SalidasComponent {
  ELEMENT_DATA = [
    { numero: 'Juan Perez', cuenta: '123456', origen: 10000, monto: 10.5, descripcion: 1.2, detalles: 'Pago de servicio' },
    { numero: 'Maria Gomez', cuenta: '654321', origen: 20000, monto: 21.0, descripcion: 1.1, detalles: 'Pago de producto' }
  ];

  displayedColumns: string[] = ['nombreCliente', 'cuenta', 'transferenciaBolivares', 'conversion', 'tasa', 'detalles'];
  dataSource = this.ELEMENT_DATA;
}
