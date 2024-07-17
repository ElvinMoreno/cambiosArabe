import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'gastos',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './gastos.component.html',
  styleUrls: ['./gastos.component.css']
})
export class GastosComponent {
  ELEMENT_DATA = [
    { numero: 'Gasto 1', descripcion: 'Primera' },
    { numero: 'Gasto 2', descripcion: 'Segunda' }
  ];
  displayedColumns: string[] = ['numero', 'descripcion'];
  dataSource = this.ELEMENT_DATA;
}
