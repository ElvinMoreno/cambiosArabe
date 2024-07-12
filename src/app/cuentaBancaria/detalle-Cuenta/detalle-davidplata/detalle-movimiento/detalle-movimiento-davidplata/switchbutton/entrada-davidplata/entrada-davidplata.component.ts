import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'entrada-davidplata',
  standalone: true,
  imports: [MatIconModule,
    MatTableModule,
    CommonModule,
    MatButtonModule,
  ],
  templateUrl: './entrada-davidplata.component.html',
  styleUrl: './entrada-davidplata.component.css'
})
export class EntradaDavidplataComponent {
  ELEMENT_DATA = [
    { hora: '08:00', origen: 'Banco A', monto: 10000, descripcion: 'Pago de servicio', detalles: '' },
    { hora: '09:30', origen: 'Banco B', monto: 20000, descripcion: 'Pago de producto', detalles: '' }
  ];

  displayedColumns: string[] = ['hora', 'origen', 'monto', 'descripcion', 'detalles'];
  dataSource = this.ELEMENT_DATA;

}
