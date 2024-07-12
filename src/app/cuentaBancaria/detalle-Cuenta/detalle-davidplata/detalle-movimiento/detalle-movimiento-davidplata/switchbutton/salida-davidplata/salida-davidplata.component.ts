import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'salida-davidplata',
  standalone: true,
  imports: [MatIconModule,
    MatTableModule,
    CommonModule,
    MatButtonModule,
  ],
  templateUrl: './salida-davidplata.component.html',
  styleUrl: './salida-davidplata.component.css'
})
export class SalidaDavidplataComponent {
  ELEMENT_DATA = [
    { hora: '10:00', origen: 'Banco C', monto: 10000, descripcion: 'Pago de servicio', detalles: '' },
    { hora: '11:30', origen: 'Banco D', monto: 20000, descripcion: 'Pago de producto', detalles: '' }
  ];

  displayedColumns: string[] = ['hora', 'origen', 'monto', 'descripcion', 'detalles'];
  dataSource = this.ELEMENT_DATA;
}
