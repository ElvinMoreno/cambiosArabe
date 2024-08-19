import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { VentaPagos } from '../../../../interfaces/venta-pagos';
import { VentaBsService } from '../../../../services/venta-bs.service';
import { PendienteService } from '../../../../services/pendiente.service';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { Pendiente } from '../../../../interfaces/pendiente';
import { ConfirmarAccionComponent } from '../../../../confirmar-accion/confirmar-accion.component';

@Component({
  selector: 'app-ventas-cuentas',
  standalone: true,
  imports: [
    MatTableModule,
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    FormsModule
  ],
  templateUrl: './ventas-cuentas.component.html',
  styleUrls: ['./ventas-cuentas.component.css']
})
export class VentasCuentasComponent implements OnInit {
  displayedColumns: string[] = ['fecha', 'pesosRecibidos', 'acciones'];
  dataSource: VentaPagos[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { cuentaBancariaId: number },
    private ventaBsService: VentaBsService,
    private pendienteService: PendienteService,
    public dialogRef: MatDialogRef<VentasCuentasComponent>,
    private dialog: MatDialog
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
    const dialogRef = this.dialog.open(ConfirmarAccionComponent, {
      width: '300px',
      data: {
        message: '¿Está seguro que desea confirmar la entrada de pesos?',
        accion: 'Entradas'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.ventaBsService.confirmarVentasEntrada(this.dataSource).subscribe(
          () => {
            console.log('Ventas confirmadas con éxito');
            this.dialogRef.close(true);
          },
          (error) => {
            console.error('Error al confirmar las ventas:', error);
          }
        );
      } else {
        console.log('Confirmación de entradas cancelada.');
      }
    });
  }

  eliminarVenta(ventaId: number): void {
    const dialogRef = this.dialog.open(ConfirmarAccionComponent, {
      width: '300px',
      data: {
        message: '¿Está seguro que desea eliminar la venta?',
        accion: 'Eliminar Venta'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Si el usuario confirma, proceder con la eliminación
        this.ventaBsService.eliminarVentaPorId(ventaId).subscribe(
          () => {
            console.log('Venta eliminada con éxito');
            this.dataSource = this.dataSource.filter(venta => venta.id !== ventaId);
          },
          (error) => {
            console.error('Error al eliminar la venta:', error);
          }
        );
      } else {
        console.log('Eliminación cancelada.');
      }
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  agregarVenta(): void {
    const dialogRef = this.dialog.open(AgregarVentaModalComponent, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Lógica para crear un pendiente usando el servicio PendienteService
        const nuevoPendiente: Pendiente = {
          cuentaBancaria: { id: this.data.cuentaBancariaId } as any, // Aquí debes reemplazar "as any" con la estructura de CuentaBancaria
          monto: result
        };

        this.pendienteService.createPendiente(nuevoPendiente).subscribe(
          (response) => {
            console.log('Pendiente creado con éxito:', response);
            this.loadVentasEntradas(); // Recargar la lista de ventas
          },
          (error) => {
            console.error('Error al crear el pendiente:', error);
          }
        );
      }
    });
  }
}

@Component({
  selector: 'app-agregar-venta-modal',
  template: `
    <h2 mat-dialog-title>Agregar Venta</h2>
    <mat-dialog-content>
      <p>¿Cuánto dinero desea ingresar?</p>
      <mat-form-field>
        <input matInput type="number" [(ngModel)]="monto" placeholder="Monto" inputmode="numeric">
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="onNoClick()">Cancelar</button>
      <button mat-button [mat-dialog-close]="monto" cdkFocusInitial>Aceptar</button>
    </mat-dialog-actions>
  `,
  standalone: true,
  imports: [MatDialogModule, MatInputModule, FormsModule, MatButtonModule]
})
export class AgregarVentaModalComponent {
  monto: number | undefined;

  constructor(
    public dialogRef: MatDialogRef<AgregarVentaModalComponent>
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
