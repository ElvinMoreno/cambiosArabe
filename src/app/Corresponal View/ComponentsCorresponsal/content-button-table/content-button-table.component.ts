import { Component, Input, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-content-button-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './content-button-table.component.html',
  styleUrls: ['./content-button-table.component.css'],
})
export class ContentButtonTableComponent implements OnInit {

  @Input() columnas: { key: string; label: string }[] = [];
  @Input() datos: any[] = [];
  @Input() botones: { label: string; action: () => void }[] = [];
  @Input() fechaSeleccionada: Date | null = null;

  displayedColumns: string[] = [];

  constructor() {}

  ngOnInit(): void {
    this.displayedColumns = this.columnas.map((columna) => columna.key);
  }

  ejecutarAccion(action: () => void): void {
    action();
  }

  cambiarFecha(event: Date): void {
    this.fechaSeleccionada = event;
  }
}
