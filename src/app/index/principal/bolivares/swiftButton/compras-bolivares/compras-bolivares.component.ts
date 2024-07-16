import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { AggCompraComponent } from '../../../../formulario/agg-compra/agg-compra.component';
import { CommonModule } from '@angular/common';

import { CompraBsDTO } from '../../../../../interfaces/compra-bs-dto';
import { CompraService } from '../../../../../services/compra.service';


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
    console.log('Initializing component and loading purchases');  // Log de depuración
    this.loadCompras();
  }

  loadCompras(): void {
    this.compraService.getCompras().subscribe(
      (data: CompraBsDTO[]) => {
        console.log('Data received from backend:', data);  // Log de depuración

        this.ELEMENT_DATA = data;
        this.dataSource = [...this.ELEMENT_DATA]; // Actualizar el dataSource

        console.log('Data source updated:', this.dataSource);  // Log de depuración
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
        console.log('Compra confirmada:', result);
        this.loadCompras(); // Recargar la lista de compras
      } else {
        console.log('Compra cancelada');
      }
    });
  }
}
