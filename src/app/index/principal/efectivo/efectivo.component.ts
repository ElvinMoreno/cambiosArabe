import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-efectivo',
  standalone: true,
  imports: [MatButtonModule, MatTableModule,CommonModule],
  templateUrl: './efectivo.component.html',
  styleUrl: './efectivo.component.css'
})
export class EfectivoComponent {
  ELEMENT_DATA = [
    { fecha: 'Juan Perez', cuenta: '123456', origen: 10000, monto: 10.5 },
    { fecha: 'Maria Gomez', cuenta: '654321', origen: 20000, monto: 21.0}
  ];

  displayedColumns: string[] = ['nombreCliente', 'cuenta', 'transferenciaBolivares', 'conversion'];
  dataSource = this.ELEMENT_DATA;
}
