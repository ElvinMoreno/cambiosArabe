import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { Descripcion } from '../../../../interfaces/descripcion';
import { DescripcionService } from '../../../../services/descripcion.service';
import { MatDialog } from '@angular/material/dialog';
import { DescripcionFormComponent } from './descripion-form/descripion-form.component';

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

  constructor(
    private descripcionService: DescripcionService,
    private cdr: ChangeDetectorRef,
    public dialog: MatDialog
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
    const dialogRef = this.dialog.open(DescripcionFormComponent, {
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.descripcionService.createDescripcion(result).subscribe(
          (data: Descripcion) => {
            this.loadDescripciones();
          },
          (error) => {
            console.error('Error al guardar la descripción', error);
          }
        );
      }
    });
  }
}
