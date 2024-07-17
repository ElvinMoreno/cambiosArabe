import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

import { CompraBsDTO } from '../../../../../interfaces/compra-bs-dto';
import { CompraService } from '../../../../../services/compra.service';
import { AggCompraComponent } from '../../../../formulario/agg-compra/agg-compra.component';
import { DetallesCompraComponent } from './modal-detalles/detalles-compra/detalles-compra.component';

@Component({
  selector: 'compras-bolivares',
  standalone: true,
  imports: [MatButtonModule, MatTableModule, CommonModule, MatIconModule],
  templateUrl: './compras-bolivares.component.html',
  styleUrls: ['./compras-bolivares.component.css']
})
export class ComprasBolivaresComponent implements OnInit {
  ELEMENT_DATA: CompraBsDTO[] = [];
  displayedColumns: string[] = ['proveedorId', 'fechaCompra', 'referencia', 'montoBs', 'precio', 'tasaCompra', 'detalles'];
  dataSource = this.ELEMENT_DATA;

  constructor(
    private compraService: CompraService,
    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.loadCompras();
  }

  loadCompras(): void {
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

  openDialog(): void {
    const dialogRef = this.dialog.open(AggCompraComponent);

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
}
