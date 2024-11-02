import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { Gastos } from '../../../../interfaces/gastos';
import { GastosService } from '../../../../services/gastos.service';
import { DescripcionFormComponent } from '../descripcion/descripion-form/descripion-form.component';
import { MovimientoGastoComponent } from './modal-data-list.component';

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

  // Método para abrir el modal de detalles del gasto al hacer clic en una card
  openGastoDetails(gastoId: number): void {
    const dialogRef = this.dialog.open(MovimientoGastoComponent, {
      width: '600px',
      data: { id: gastoId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Modal cerrado');
        // Aquí puedes agregar lógica adicional si necesitas realizar alguna acción después de cerrar el modal
      }
    });
  }

  // Método para abrir el formulario de nuevo gasto
  nuevoGasto() {
    const dialogRef = this.dialog.open(DescripcionFormComponent, {
      width: '300px',
      data: {
        titulo: 'Nuevo Gasto',
        campoLabel: 'Nombre del Gasto',
        campoPlaceholder: 'Ingrese el nombre del gasto',
        formData: { texto: '' }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const nuevoGasto: Gastos = {
          nombre: result.texto,
          saldo: 0,
          ultimaActualizacion: new Date()
        };

        this.gastosService.createGasto(nuevoGasto).subscribe(
          (gastoCreado: Gastos) => {
            console.log('Gasto creado:', gastoCreado);
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
