import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatCardModule } from '@angular/material/card';

import { CompraBsDTO } from '../../../../../interfaces/compra-bs-dto';
import { CompraService } from '../../../../../services/compra.service';
import { AggCompraComponent } from '../../../../formulario/agg-compra/agg-compra.component';
import { DetallesCompraComponent } from './modal-detalles/detalles-compra/detalles-compra.component';

@Component({
  selector: 'compras-bolivares',
  standalone: true,
  imports: [
    MatButtonModule,
    MatTableModule,
    CommonModule,
    MatIconModule,
    MatCardModule
  ],
  templateUrl: './compras-bolivares.component.html',
  styleUrls: ['./compras-bolivares.component.css']
})
export class ComprasBolivaresComponent implements OnInit {
  ELEMENT_DATA: CompraBsDTO[] = [];
  displayedColumns: string[] = ['proveedorId', 'fechaCompra', 'referencia', 'montoBs', 'precio', 'tasaCompra', 'detalles'];
  dataSource = this.ELEMENT_DATA;
  isMobile = false;

  constructor(
    private compraService: CompraService,
    public dialog: MatDialog,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this.loadCompras();
    this.detectMobileView();
  }

  private detectMobileView(): void {
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
      this.isMobile = result.matches;
    });
  }

  private loadCompras(): void {
    this.compraService.getCompras().subscribe(
      (data: CompraBsDTO[]) => {
        this.ELEMENT_DATA = data;
        this.dataSource = [...this.ELEMENT_DATA];
        console.log(data);
      },
      (error) => {
        console.error('Error al obtener las compras:', error);
      }
    );
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
}
