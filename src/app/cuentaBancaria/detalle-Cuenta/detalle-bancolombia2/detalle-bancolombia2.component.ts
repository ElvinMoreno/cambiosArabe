import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detalle-bancolombia2',
  standalone: true,
  imports: [MatButtonModule,
    MatDividerModule,
    MatCardModule,
    MatTableModule,
    CommonModule,
    MatIconModule],
  templateUrl: './detalle-bancolombia2.component.html',
  styleUrl: './detalle-bancolombia2.component.css'
})
export class DetalleBancolombia2Component {
  ELEMENT_DATA = [
    { fecha: '01/01/2023', entrada: '123456', salida: 10000, saldodia: 10.5},
    { fecha: '02/01/2023', entrada: '654321', salida: 20000, saldodia: 21.0}
  ];

  displayedColumns: string[] = ['fecha', 'entrada', 'salida', 'saldodia', 'detalles'];
  dataSource = this.ELEMENT_DATA;

  constructor(private router: Router) {}

  navegar(ruta: string) {
    this.router.navigate([ruta]);
  }
}
