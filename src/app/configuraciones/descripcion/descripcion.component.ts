import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-descripcion',
  standalone: true,
  imports: [MatButtonModule,MatTableModule,CommonModule],
  templateUrl: './descripcion.component.html',
  styleUrl: './descripcion.component.css'
})
export class DescripcionComponent {
  ELEMENT_DATA = [
    { numero: 'Juan Perez', descripcion: 'Primera'},
    { numero: 'Maria Gomez', descripcion: 'Segunda'}
  ];

  displayedColumns: string[] = ['nombreCliente', 'cuenta'];
  dataSource = this.ELEMENT_DATA;
}
