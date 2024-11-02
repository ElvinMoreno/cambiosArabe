import { Component, Inject, OnInit } from '@angular/core';
import { PagoGastos } from '../../../../interfaces/pago-gastos';
import { GastosService } from '../../../../services/gastos.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-movimiento-gasto',
  standalone: true,
  template: `
    <h2 mat-dialog-title >Movimientos de {{gastoNombre}}</h2>
    <mat-dialog-content>
      <table mat-table [dataSource]="movimientos" *ngIf="movimientos.length > 0" class="mat-elevation-z8">
        <!-- Fecha Column -->
        <ng-container matColumnDef="fecha">
          <th mat-header-cell *matHeaderCellDef> Fecha </th>
          <td mat-cell *matCellDef="let movimiento"> {{ movimiento.fecha | date }} </td>
        </ng-container>

        <!-- Monto Column -->
        <ng-container matColumnDef="monto">
          <th mat-header-cell *matHeaderCellDef> Monto </th>
          <td mat-cell *matCellDef="let movimiento"> {{ movimiento.monto | currency }} </td>
        </ng-container>

        <!-- Descripción Column -->
        <ng-container matColumnDef="descripcion">
          <th mat-header-cell *matHeaderCellDef> Salió de </th>
          <td mat-cell *matCellDef="let movimiento"> {{ movimiento.descriocion }} </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>

      <p *ngIf="movimientos.length === 0">No se encontraron movimientos para el ID proporcionado.</p>
    </mat-dialog-content>
  `,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent
  ]
})
export class MovimientoGastoComponent implements OnInit {
  movimientos: PagoGastos[] = [];
  gastoNombre: string = '';
  displayedColumns: string[] = ['fecha', 'monto', 'descripcion'];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { id: number },
    private gastosService: GastosService
  ) {}

  ngOnInit(): void {
    this.fetchMovimientos(this.data.id);
  }

  fetchMovimientos(gastoId: number): void {
    this.gastosService.getMovimientoGastoById(gastoId).subscribe(
      (data: PagoGastos[]) => {
        this.movimientos = data;
        if (data.length > 0) {
          this.gastoNombre = data[0].gasto.nombre;
        }
      },
      (error) => {
        console.error('Error al obtener movimientos de gasto:', error);
        this.movimientos = [];
      }
    );
  }
}
