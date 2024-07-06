import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

import { VentasBolivaresComponent } from './swiftButton/ventas-bolivares/ventas-bolivares.component';
import { ComprasBolivaresComponent } from './swiftButton/compras-bolivares/compras-bolivares.component';


@Component({
  selector: 'app-bolivares',
  standalone: true,
  imports: [MatButtonModule,
    ComprasBolivaresComponent,
    VentasBolivaresComponent,
    CommonModule

  ],
  templateUrl: './bolivares.component.html',
  styleUrl: './bolivares.component.css'
})
export class BolivaresComponent implements OnInit {
  vistaActual: 'compras' | 'ventas' = 'compras';

  ngOnInit() {
    // Inicializa la vista con compras por defecto
    this.mostrarCompras();
  }

  mostrarCompras() {
    this.vistaActual = 'compras';
  }

  mostrarVentas() {
    this.vistaActual = 'ventas';
  }

}
