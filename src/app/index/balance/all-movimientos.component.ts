import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MovimientoDiaDTO } from '../../interfaces/MovimientoDiaDTO';
import { MovimientoService } from '../../services/movimiento.service';
import { DetalleMovimientoCompGenComponent } from '../../shared/detalle-movimiento-comp-gen/detalle-movimiento-comp-gen.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-all-movimientos',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatDialogModule, CommonModule, MatButtonModule],
  template: `
    <mat-table [dataSource]="dataSource" class="mat-elevation-z8">
      <!-- Fecha Column -->
      <ng-container matColumnDef="fecha">
        <mat-header-cell *matHeaderCellDef class="custom-header"> Fecha </mat-header-cell>
        <mat-cell *matCellDef="let element"> {{ element.fecha | date: 'MM/dd/yy' }} </mat-cell>
      </ng-container>

      <!-- Valor Column -->
      <ng-container matColumnDef="valor">
        <mat-header-cell *matHeaderCellDef class="custom-header"> Valor </mat-header-cell>
        <mat-cell *matCellDef="let element"> {{ element.monto | currency }} </mat-cell>
      </ng-container>

      <!-- Saldo Actual Column -->
      <ng-container matColumnDef="saldoActual">
        <mat-header-cell *matHeaderCellDef class="custom-header"> Saldo Actual </mat-header-cell>
        <mat-cell *matCellDef="let element"> {{ element.saldoActual | currency }} </mat-cell>
      </ng-container>

      <!-- Header and Row Definitions -->
      <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
      <mat-row *matRowDef="let row; columns: displayedColumns;" (click)="verDetalle(row)"></mat-row>
    </mat-table>

    <!-- Paginador -->
    <mat-paginator [length]="dataSource.data.length"
                   [pageSize]="10"
                   [pageSizeOptions]="[5, 10, 25, 100]">
    </mat-paginator>
  `,
  styles: [
    `
      table {
        width: 100%;
      }

      .mat-header-cell,
      .mat-cell {
        text-align: center;
      }

      .mat-elevation-z8 {
        margin: 20px 0;
      }

      mat-row {
        cursor: pointer;
      }
      .custom-header {
      background-color: #4a90e2 !important;
      color: white !important;
     }


    `,
  ],
})
export class AllMovimientosComponent implements OnInit {
  displayedColumns: string[] = ['fecha', 'valor', 'saldoActual'];
  dataSource = new MatTableDataSource<MovimientoDiaDTO>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private movimientoService: MovimientoService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.movimientoService.getAllMovimientos().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
      },
      error: (err) => {
        console.error('Error al obtener movimientos:', err);
      },
    });
  }

  verDetalle(movimiento: MovimientoDiaDTO): void {
    const data = {
      ...movimiento,
      tipoMovimiento: typeof movimiento.tipoMovimiento === 'object'
        ? JSON.stringify(movimiento.tipoMovimiento)
        : movimiento.tipoMovimiento,
      descripcion: typeof movimiento.descripcion === 'object'
        ? JSON.stringify(movimiento.descripcion)
        : movimiento.descripcion,
    };

    this.dialog.open(DetalleMovimientoCompGenComponent, {
      width: '400px',
      data: {
        title: 'Detalles del Movimiento',
        id: movimiento.id,
        data,
        fields: [
          { label: 'Fecha', key: 'fecha', format: 'date' },
          { label: 'Tipo de Movimiento', key: 'tipoMovimiento' },
          { label: 'Monto', key: 'monto', format: 'currency' },
          { label: 'Descripción', key: 'descripcion' },
          ...(movimiento.descripcion === 'Venta BS'
            ? [
                { label: 'Cliente', key: 'nombreClienteFinal' },
                { label: 'Tasa', key: 'tasaVenta' },
                { label: 'Bolivares Vendidos', key: 'bolivaresVendidos', format: 'currency' },
              ]
            : []),
        ],
        showCloseButton: true,
        closeButtonLabel: 'Cerrar',
      },
    });
  }
}

