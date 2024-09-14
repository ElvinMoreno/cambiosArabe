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

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.confirmarVentaSalida(element);
      }
    });
  }

  openBancosDialog(element: CuentaDestinatario): void {
    if (!element.ventaBsId) {
      console.error('Error: El ID de la venta es nulo.');
      Swal.fire({
        title: 'Error',
        text: 'No se puede abrir el diálogo de bancos porque la venta no tiene un ID asociado.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      return;
    }

    // Abrir el modal para seleccionar un banco, pasando el `ventaId`
    const dialogRef = this.dialog.open(ModalBancosComponent, {
      data: { ventaId: element.ventaBsId }  // Pasamos el ventaBsId al modal
    });

    // Cuando el modal se cierra
    dialogRef.afterClosed().subscribe(result => {
      // Verificar si se devolvió un `cuentaId` desde el modal
      if (result && result.cuentaId) {
        console.log(`Modal cerrado. Banco seleccionado (cuentaId): ${result.cuentaId} para venta (ventaBsId): ${element.ventaBsId}`);

        // Llamamos al servicio para actualizar el banco de la venta
        this.ventaBsService.updateBancoBs(element.ventaBsId!, result.cuentaId).subscribe(
          () => {
            console.log('Banco Bs actualizado con éxito para la venta', element.ventaBsId);

            // Recargar la lista de ventas para reflejar los cambios
            this.loadVentas();

            // Confirmar la venta inmediatamente después de actualizar el banco
            // this.confirmarVentaSalida(element);
          },
          error => {
            console.error('Error al actualizar el banco para la venta', error);
            Swal.fire({
              title: 'Error',
              text: 'Ocurrió un error al actualizar el banco de la venta. Inténtalo de nuevo.',
              icon: 'error',
              confirmButtonText: 'Aceptar'
            });
          }
        );
      } else {
        console.log('El modal se cerró sin seleccionar un banco.');
      }
    });
  }



  updateVentaBanco(ventaId: number, updatedVenta: VentaBs): void {
    this.ventaBsService.updateVentaBs(ventaId, updatedVenta).subscribe(
      response => {
        console.log('Venta actualizada con la cuenta bancaria seleccionada', response);
        this.loadVentas(); // Recargar la lista tras la actualización
      },
      error => {
        console.error('Error al actualizar la venta con la cuenta bancaria seleccionada', error);
      }
    );
  }

  confirmarVentaSalida(venta: CuentaDestinatario): void {
    const nombreCuenta = venta.nombreClienteFinal || 'N/A';

    // Envolver la venta en un array antes de enviar la petición
    const ventasAConfirmar: CuentaDestinatario[] = [venta]; // Convertir a lista

    // Confirmación de la venta
    this.ventaBsService.confirmarVentaSalida(ventasAConfirmar).subscribe(
      response => {
        console.log('Venta confirmada', response);

        Swal.fire({
          title: 'Venta Confirmada',
          text: `Mandar capture a: ${nombreCuenta}.`,
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });

        this.loadVentas(); // Recargar las ventas tras la confirmación
      },
      // error => {
      //   console.error('Error al confirmar la venta', error);

      //   Swal.fire({
      //     title: 'Error',
      //     text: 'Ocurrió un error al confirmar la venta.',
      //     icon: 'error',
      //     confirmButtonText: 'Aceptar'
      //   });
      // }
    );
  }

  copyToClipboard(value: string | number, id: number, field: string): void {
    if (this.isCopied(id, field)) {
      alert("Este texto ya ha sido copiado anteriormente");
      return;
    }

    // Verificar si el valor es numérico y formatearlo a dos decimales si es necesario
    const formattedValue = typeof value === 'number' ? value.toFixed(2) : value;

    navigator.clipboard.writeText(formattedValue).then(() => {
      console.log('Texto copiado al portapapeles:', formattedValue);
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
    return !!element.ventaBsId; // Comprobar si tiene un `ventaBsId` válido
  }
}
