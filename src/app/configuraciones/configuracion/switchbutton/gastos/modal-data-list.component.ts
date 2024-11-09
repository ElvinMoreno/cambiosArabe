import { Component, Inject, OnInit } from '@angular/core';
import { PagoGastos } from '../../../../interfaces/pago-gastos';
import { GastosService } from '../../../../services/gastos.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-movimiento-gasto',
  standalone: true,
  template: `
    <h2 mat-dialog-title>Movimientos de {{ gastoNombre }}</h2>
    <mat-dialog-content>
      <table mat-table [dataSource]="movimientos" *ngIf="movimientos.length > 0" class="mat-elevation-z8">

        <!-- Icon Column -->
        <!-- <ng-container matColumnDef="icon">
          <th mat-header-cell *matHeaderCellDef> </th>
          <td mat-cell *matCellDef="let movimiento">
            <mat-icon class="icon" (click)="openDateInput(movimiento)">date_range</mat-icon>
          </td>
        </ng-container> -->

        <!-- Fecha Column with Datepicker Input -->
        <ng-container matColumnDef="fecha">
          <th mat-header-cell *matHeaderCellDef> Fecha </th>
          <td mat-cell *matCellDef="let movimiento">
            <mat-form-field appearance="fill" *ngIf="isDateInputOpenFor(movimiento)">
              <input matInput [matDatepicker]="picker" [(ngModel)]="movimiento.fecha" class="date-input">
              <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>

              <!-- Icono de confirmación -->
              <mat-icon class="check-icon" (click)="confirmDateChange(movimiento)">check</mat-icon>
            </mat-form-field>
            <span *ngIf="!isDateInputOpenFor(movimiento)">
              {{ movimiento.fecha | date }}
            </span>
          </td>
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
  styles: [
    '.icon { color: #4a90e2; cursor: pointer; }',
    '.date-field { display: flex; align-items: center; width: 150px; }',
    '.date-input { width: 100px; }',
    '.check-icon { color: #4a90e2; margin-left: auto; cursor: pointer; padding-top: 0.2rem; }'
  ],
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule
  ]
})
export class MovimientoGastoComponent implements OnInit {
  movimientos: PagoGastos[] = [];
  gastoNombre: string = '';
  // displayedColumns: string[] = ['icon', 'fecha', 'monto', 'descripcion'];
  displayedColumns: string[] = ['fecha', 'monto', 'descripcion'];
  openedDateInputs: Set<number> = new Set();

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

  openDateInput(movimiento: PagoGastos): void {
    this.openedDateInputs.add(movimiento.id!);
  }

  isDateInputOpenFor(movimiento: PagoGastos): boolean {
    return this.openedDateInputs.has(movimiento.id!);
  }

  confirmDateChange(movimiento: PagoGastos): void {
    const formattedDate = formatDate(movimiento.fecha, 'yyyy-MM-dd', 'en-US'); // Formatea la fecha
    this.gastosService.modificarFechaGasto(movimiento.id!, formattedDate).subscribe(
      (response) => {
        console.log('Fecha actualizada correctamente:', response);
        this.openedDateInputs.delete(movimiento.id!); // Cierra el campo de fecha
      },
      (error) => {
        console.error('Error al actualizar la fecha:', error);
        console.log(formattedDate);
        console.log(movimiento.id!);
      }
    );
  }
}
