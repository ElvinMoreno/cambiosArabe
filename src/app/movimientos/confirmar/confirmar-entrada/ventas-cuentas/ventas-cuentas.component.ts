import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { VentaPagos } from '../../../../interfaces/venta-pagos';
import { VentaBsService } from '../../../../services/venta-bs.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-ventas-cuentas',
  standalone: true,
  imports: [
    MatTableModule,
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './ventas-cuentas.component.html',
  styleUrls: ['./ventas-cuentas.component.css']
})
export class VentasCuentasComponent implements OnInit {
  displayedColumns: string[] = ['fecha', 'pesosRecibidos', 'acciones']; // Añadimos la columna "Acciones"
  dataSource: VentaPagos[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { cuentaBancariaId: number },
    private ventaBsService: VentaBsService,
    public dialogRef: MatDialogRef<VentasCuentasComponent>
  ) {}

  ngOnInit(): void {
    this.loadVentasEntradas();
  }

  loadVentasEntradas(): void {
    this.ventaBsService.getVentasEntradas(this.data.cuentaBancariaId).subscribe(
      (data: VentaPagos[]) => {
        this.dataSource = data;
      },
      (error) => {
        console.error('Error al cargar las ventas:', error);
      }
    );
  }

  confirmarEntradas(): void {
    this.ventaBsService.confirmarVentasEntrada(this.dataSource).subscribe(
      () => {
        console.log('Ventas confirmadas con éxito');
        this.dialogRef.close(true); // Cerrar el diálogo y pasar 'true' como resultado
      },
      (error) => {
        console.error('Error al confirmar las ventas:', error);
      }
    );
  }

  eliminarVenta(ventaId: number): void {
    this.ventaBsService.eliminarVentaPorId(ventaId).subscribe(
      () => {
        console.log('Venta eliminada con éxito');
        this.dataSource = this.dataSource.filter(venta => venta.id !== ventaId); // Actualizar la lista después de eliminar
      },
      (error) => {
        console.error('Error al eliminar la venta:', error);
      }
    );
  }

  closeDialog(): void {
    this.dialogRef.close(); // Cerrar el diálogo sin hacer nada
  }
}
