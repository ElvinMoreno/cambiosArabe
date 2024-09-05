import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { ModalBancosComponent } from './modal-bancos/modal-bancos.component';
import { CuentaDestinatario } from '../../../interfaces/cuenta-destinatario';
import { VentaBsService } from '../../../services/venta-bs.service';
import { ConfirmarAccionComponent } from '../../../confirmar-accion/confirmar-accion.component';
import { VentaBs } from '../../../interfaces/venta-bs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-confirmar-salida',
  standalone: true,
  imports: [MatButtonModule, MatTableModule, CommonModule, MatDialogModule, MatIconModule, MatCardModule],
  templateUrl: './confirmar-salida.component.html',
  styleUrls: ['./confirmar-salida.component.css']
})
export class ConfirmarSalidaComponent implements OnInit {
  displayedColumns: string[] = ['banco', 'cedula', 'cuenta', 'nombre', 'bolivares', 'cuentaUsada', 'acciones'];
  dataSource: CuentaDestinatario[] = [];
  isMobile = false;
  updatedVentas: Set<number> = new Set();  // Mantener el seguimiento de ventas actualizadas
  copiedIcons: { [key: number]: { [key: string]: boolean } } = {};

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
      (data: CuentaDestinatario[]) => {
        this.dataSource = data;
        console.log(data);
      },
      (error) => {
        console.error('Error al cargar las ventas:', error);
      }
    );
  }

  openConfirmDialog(element: CuentaDestinatario): void {
    const dialogRef = this.dialog.open(ConfirmarAccionComponent, {
      data: {
        message: `¿Desea confirmar que realizó la transacción?`,
        accion: 'Salida',
        venta: element
      }
    });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     this.confirmarVentaSalida(element);
    //   }
    // });
  }

  // confirmarVentaSalida(venta: CuentaDestinatario): void {
  //   const nombreCuenta = venta.nombreCuentaDestinatario || 'N/A';

  //   this.ventaBsService.confirmarVentaSalida(venta).subscribe(
  //     response => {
  //       console.log('Venta confirmada', response);

  //       Swal.fire({
  //         title: 'Venta Confirmada',
  //         text: `Mandar capture a: ${nombreCuenta}.`,
  //         icon: 'success',
  //         confirmButtonText: 'Aceptar'
  //       });

  //       this.loadVentas();
  //     },
  //     error => {
  //       console.error('Error al confirmar la venta', error);

  //       Swal.fire({
  //         title: 'Error',
  //         text: 'Ocurrió un error al confirmar la venta.',
  //         icon: 'error',
  //         confirmButtonText: 'Aceptar'
  //       });
  //     }
  //   );
  // }

  openBancosDialog(element: CuentaDestinatario): void {
    const dialogRef = this.dialog.open(ModalBancosComponent, {
      data: { ventaId: element.ventaBsId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.ventaBsService.getVentaBsById(result.ventaId).subscribe(
          (venta: VentaBs) => {
            const updatedVenta: VentaBs = {
              ...venta,
              cuentaBancariaBs: result.cuentaId
            };

            this.updateVentaBanco(result.ventaId, updatedVenta);
            this.updatedVentas.add(result.ventaId);
          },
          error => {
            console.error('Error al obtener la venta por ID', error);
          }
        );
      }
    });
  }

  updateVentaBanco(ventaId: number, updatedVenta: VentaBs): void {
    this.ventaBsService.updateVentaBs(ventaId, updatedVenta).subscribe(
      response => {
        console.log('Venta actualizada con la cuenta bancaria seleccionada', response);
        this.loadVentas();
      },
      error => {
        console.error('Error al actualizar la venta con la cuenta bancaria seleccionada', error);
      }
    );
  }

  copyToClipboard(value: string, id: number, field: string): void {
    if (this.isCopied(id, field)) {
      alert("Este texto ya ha sido copiado anteriormente");
      return;
    }

    navigator.clipboard.writeText(value).then(() => {
      console.log('Texto copiado al portapapeles:', value);
      if (!this.copiedIcons[id]) {
        this.copiedIcons[id] = {};
      }
      this.copiedIcons[id][field] = true;
    }).catch(err => {
      console.error('Error al copiar el texto al portapapeles:', err);
    });
  }

  isCopied(id: number, field: string): boolean {
    return this.copiedIcons[id]?.[field] || false;
  }

  shouldRemoveBorder(element: CuentaDestinatario): boolean {
    return !!element.ventaBsId;
  }
}
