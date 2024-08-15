import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { ConfirmarEntradaComponent } from './confirmar-entrada/confirmar-entrada.component';
import { ConfirmarSalidaComponent } from './confirmar-salida/confirmar-salida.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirmar',
  standalone: true,
  imports: [
    MatButtonModule,
    CommonModule,
    MatTabsModule,
    ConfirmarEntradaComponent,
    ConfirmarSalidaComponent
  ],
  templateUrl: './confirmar.component.html',
  styleUrl: './confirmar.component.css'
})
export class ConfirmarComponent {
  vistaActual: 'entradas' | 'salidas' = 'entradas';
  selectedIndex: number = 0;

  constructor(private router: Router, public dialog: MatDialog) {}

  ngOnInit() {
    // La vista 'entradas' ya está establecida por defecto
  }

  cambiarVista(index: number) {
    const vistas = ['entradas', 'salidas'];
    this.vistaActual = vistas[index] as 'entradas' | 'salidas';
  }
}
