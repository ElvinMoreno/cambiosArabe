import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'descripcion',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  templateUrl: './descripcion.component.html',
  styleUrls: ['./descripcion.component.css']
})
export class DescripcionComponent {
  ELEMENT_DATA = [
    { numero: 'Juan Perez', descripcion: 'Primera' },
    { numero: 'Maria Gomez', descripcion: 'Segunda' }
  ];
  displayedColumns: string[] = ['numero', 'descripcion'];
  dataSource = this.ELEMENT_DATA;
}
