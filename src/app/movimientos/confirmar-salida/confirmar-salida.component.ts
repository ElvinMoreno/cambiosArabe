import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { VentaBsService } from '../../services/venta-bs.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { ConfirmarAccionComponent } from '../../confirmar-accion/confirmar-accion.component';
import { ModalBancosComponent } from './modal-bancos/modal-bancos.component';
import { VentaPagos } from '../../interfaces/venta-pagos';
import { VentaBs } from '../../interfaces/venta-bs';
import { PartialVentaBs } from '../../interfaces/partial-venta-bs';

@Component({
  selector: 'app-confirmar-salida',
  standalone: true,
  imports: [MatButtonModule, MatTableModule, CommonModule, MatDialogModule, MatIconModule, MatCardModule],
  templateUrl: './confirmar-salida.component.html',
  styleUrls: ['./confirmar-salida.component.css']
})
export class ConfirmarSalidaComponent implements OnInit {
  displayedColumns: string[] = ['cuentaBs', 'cuentaCop', 'metodoPago', 'cliente', 'tasa', 'fecha', 'bolivares', 'pesos'];
  dataSource: VentaPagos[] = [];
  isMobile = false;

  constructor(
    public dialog: MatDialog,
    private ventaBsService: VentaBsService,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this.loadVentas();
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.breakpointObserver.observe([Breakpoints.Handset])
      .subscribe(result => {
        this.isMobile = result.matches;
      });
  }

  loadVentas(): void {
    this.ventaBsService.getVentasSalidas().subscribe(
      (data: VentaPagos[]) => {
        this.dataSource = data;
        console.log(data);
      },
      (error) => {
        console.error('Error al cargar las ventas:', error);
      }
    );
  }

  openConfirmDialog(element: VentaPagos): void {
    const dialogRef = this.dialog.open(ConfirmarAccionComponent, {
      data: {
        message: `¿Desea confirmar que realizó la transacción?`,
        accion: 'Salida',
        venta: element
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.confirmarVentaSalida(element);
      }
    });
  }

  openBancosDialog(element: VentaPagos): void {
    const dialogRef = this.dialog.open(ModalBancosComponent, {
      data: { venta: element }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateVentaBanco(result.venta.id, result.bancoId);
      }
    });
  }

  updateVentaBanco(ventaId: number, bancoId: string): void {
    this.ventaBsService.getVentaBsById(ventaId).subscribe(
      (venta: VentaBs) => {
        const updatedVenta: PartialVentaBs = {
          cuentaBancariaBolivares: { id: bancoId }
        };
        this.ventaBsService.updateVentaBs(ventaId, updatedVenta as unknown as VentaBs).subscribe(
          response => {
            console.log('Venta actualizada con banco seleccionado', response);
            this.loadVentas();  // Recargar las ventas después de la actualización
          },
          error => {
            console.error('Error al actualizar la venta con el banco seleccionado', error);
          }
        );
      },
      error => {
        console.error('Error al obtener la venta', error);
      }
    );
  }

  confirmarVentaSalida(venta: VentaPagos): void {
    console.log('Cuerpo de la petición:', venta);  // Agregado para ver el cuerpo de la petición
    this.ventaBsService.confirmarVentaSalida(venta).subscribe(
      response => {
        console.log('Venta confirmada', response);
        this.loadVentas();  // Recargar las ventas después de la confirmación
      },
      error => {
        console.error('Error al confirmar la venta', error);
      }
    );
  }
}
