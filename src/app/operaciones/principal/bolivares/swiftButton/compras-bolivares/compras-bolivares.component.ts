import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { CompraBsDTO } from '../../../../../interfaces/compra-bs-dto';
import { CompraService } from '../../../../../services/compra.service';
import { AggCompraComponent } from '../../../../formulario/agg-compra/agg-compra.component';
import { DetallesCompraComponent } from './modal-detalles/detalles-compra/detalles-compra.component';
import { ActualizarCompraComponent } from './actualizar-compra/actualizar-compra.component';

@Component({
  selector: 'compras-bolivares',
  standalone: true,
  imports: [
    MatButtonModule,
    MatTableModule,
    CommonModule,
    MatIconModule
  ],
  templateUrl: './compras-bolivares.component.html',
  styleUrls: ['./compras-bolivares.component.css']
})
export class ComprasBolivaresComponent implements OnInit {
  ELEMENT_DATA: CompraBsDTO[] = [];
  dataSource = this.ELEMENT_DATA;
  displayedColumns: string[] = [];

  constructor(
    private compraService: CompraService,
    public dialog: MatDialog,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this.loadCompras();
    this.setTableColumns();
  }

  private loadCompras(): void {
    this.compraService.getCompras().subscribe(
      (data: CompraBsDTO[]) => {
        this.ELEMENT_DATA = data;
        this.dataSource = [...this.ELEMENT_DATA];
      },
      (error) => {
        console.error('Error al obtener las compras:', error);
      }
    );
  }

  private setTableColumns(): void {
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
      if (result.matches) {
        // Vista móvil: excluir las columnas 'proveedorId' y 'precio'
        this.displayedColumns = ['fechaCompra', 'referencia', 'montoBs', 'tasaCompra', 'acciones'];
      } else {
        // Vista de escritorio: mostrar todas las columnas
        this.displayedColumns = ['proveedorId', 'fechaCompra', 'referencia', 'montoBs', 'precio', 'tasaCompra', 'acciones'];
      }
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AggCompraComponent);

    dialogRef.componentInstance.compraCreada.subscribe(() => {
      this.loadCompras();
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCompras();
      }
    });
  }

  openDetallesDialog(id: number): void {
    this.dialog.open(DetallesCompraComponent, {
      data: { id: id },
      width: '600px',
    });
  }

  openActualizarCompraDialog(id: number): void {
    const dialogRef = this.dialog.open(ActualizarCompraComponent, {
      data: { compraId: id },
      width: '600px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCompras(); // Recargar la lista de compras después de actualizar
      }
    });
  }
}
