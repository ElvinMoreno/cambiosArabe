import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { DescripcionComponent } from './switchbutton/descripcion/descripcion.component';
import { GastosComponent } from './switchbutton/gastos/gastos.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [CommonModule, MatButtonModule,
    DescripcionComponent, GastosComponent,
  MatButtonModule],
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.css']
})
export class ConfiguracionComponent {

  constructor(private router: Router) {}

  navegar(ruta: string) {
    this.router.navigate([ruta]);
  }
  vistaActual: 'descripcion' | 'gastos' = 'descripcion';
  ngOnInit() {
    // La vista 'compras' ya está establecida por defecto
  }

  cambiarVista(vista: 'descripcion' | 'gastos') {
    this.vistaActual = vista;

  }

}
