import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { Descripcion } from '../../../../interfaces/descripcion';
import { DescripcionService } from '../../../../services/descripcion.service';

@Component({
  selector: 'descripcion',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    FormsModule
  ],
  templateUrl: './descripcion.component.html',
  styleUrls: ['./descripcion.component.css']
})
export class DescripcionComponent implements OnInit {
  displayedColumns: string[] = ['id', 'texto', 'acciones'];
  dataSource: Descripcion[] = [];
  newDescripcion: Descripcion = { id: 0, texto: '' };
  isNewRow = false;

  constructor(
    private descripcionService: DescripcionService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadDescripciones();
  }

  loadDescripciones() {
    this.descripcionService.getAllDescripciones().subscribe(
      (data: Descripcion[]) => {
        this.dataSource = [...data];
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error al cargar las descripciones', error);
      }
    );
  }

  nuevaDescripcion() {
    if (this.isNewRow && this.newDescripcion.texto.trim() === '') {
      // Si la fila nueva está abierta y el campo de texto está vacío, cierra la fila
      this.isNewRow = false;
    } else {
      // Si no, abre una nueva fila
      this.isNewRow = true;
      this.newDescripcion = { id: this.getNextId(), texto: '' };
    }
    this.cdr.detectChanges();
  }

  getNextId(): number {
    return this.dataSource.length > 0 ? Math.max(...this.dataSource.map(d => d.id || 0)) + 1 : 1;
  }

  guardarDescripcion() {
    if (this.newDescripcion.texto.trim()) {
      this.descripcionService.createDescripcion(this.newDescripcion).subscribe(
        (data: Descripcion) => {
          this.loadDescripciones();
          this.newDescripcion = { id: 0, texto: '' };
          this.isNewRow = false;
        },
        (error) => {
          console.error('Error al guardar la descripción', error);
        }
      );
    } else {
      // Si el campo de texto está vacío, simplemente cierra la fila
      this.isNewRow = false;
    }
    this.cdr.detectChanges();
  }
}
