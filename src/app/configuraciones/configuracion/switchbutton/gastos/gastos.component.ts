import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { Gastos } from '../../../../interfaces/gastos';
import { GastosService } from '../../../../services/gastos.service';
import { DescripcionFormComponent } from '../descripcion/descripion-form/descripion-form.component';

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
export class GastosComponent implements OnInit {
  ELEMENT_DATA: Gastos[] = [];
  dataSource = this.ELEMENT_DATA;

  constructor(private gastosService: GastosService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadGastos();
  }

  loadGastos(): void {
    this.gastosService.getAllGastos().subscribe(
      (gastos: Gastos[]) => {
        this.ELEMENT_DATA = gastos;
        this.dataSource = [...this.ELEMENT_DATA];
      },
      error => {
        console.error('Error al cargar los gastos:', error);
      }
    );
  }

  nuevoGasto() {
    const dialogRef = this.dialog.open(DescripcionFormComponent, {
      width: '300px',
      data: {
        titulo: 'Nuevo Gasto',
        campoLabel: 'Nombre del Gasto',
        campoPlaceholder: 'Ingrese el nombre del gasto',
        formData: { texto: '' }  // Aquí `texto` se usará como el nombre del gasto
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Crear un nuevo objeto de gasto basado en el resultado del formulario
        const nuevoGasto: Gastos = {
          nombre: result.texto,
          saldo: 0,  // Valor por defecto
          ultimaActualizacion: new Date()  // Fecha actual
        };

        // Llamar al servicio para crear el nuevo gasto
        this.gastosService.createGasto(nuevoGasto).subscribe(
          (gastoCreado: Gastos) => {
            console.log('Gasto creado:', gastoCreado);

            // Actualizar la lista de gastos con el nuevo gasto
            this.ELEMENT_DATA.push(gastoCreado);
            this.dataSource = [...this.ELEMENT_DATA];
          },
          error => {
            console.error('Error al crear el gasto:', error);
          }
        );
      }
    });
  }
}
