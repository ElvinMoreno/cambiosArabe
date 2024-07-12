import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { EntradaDavidplataComponent } from './switchbutton/entrada-davidplata/entrada-davidplata.component';
import { SalidaDavidplataComponent } from './switchbutton/salida-davidplata/salida-davidplata.component';


@Component({
  selector: 'app-detalle-movimiento-davidplata',
  standalone: true,
  imports: [MatIconModule,
    MatTableModule,
    CommonModule,
    MatButtonModule,
    EntradaDavidplataComponent,
    SalidaDavidplataComponent,
    CommonModule
  ],
  templateUrl: './detalle-movimiento-davidplata.component.html',
  styleUrl: './detalle-movimiento-davidplata.component.css'
})
export class DetalleMovimientoDavidplataComponent {

  constructor(private router: Router) {}

  navegar(ruta: string) {
    this.router.navigate([ruta]);
  }
  vistaActual: 'entradas' | 'salidas' = 'salidas';
  ngOnInit() {
    // La vista 'compras' ya está establecida por defecto
  }

  cambiarVista(vista: 'entradas' | 'salidas') {
    this.vistaActual = vista;

  }

}
