import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import {MatMenuModule} from '@angular/material/menu';
import { ModalBancosComponent } from './modal-bancos/modal-bancos.component';
import { CuentaDestinatario } from '../../../interfaces/cuenta-destinatario';
import { VentaBsService } from '../../../services/venta-bs.service';
import { ConfirmarAccionComponent } from '../../../confirmar-accion/confirmar-accion.component';
import { VentaBs } from '../../../interfaces/venta-bs';
import Swal from 'sweetalert2';
import { PagoParcialComponent } from './pago-parcial.component';
import { CuentaDestinatarioService } from '../../../services/cuenta-destinatario.service';

@Component({
  selector: 'app-confirmar-salida',
  standalone: true,
  imports: [MatButtonModule, MatTableModule,
     CommonModule, MatDialogModule, MatIconModule, MatCardModule, MatMenuModule],
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
    private breakpointObserver: BreakpointObserver,
    private cuentaDestinatarioService: CuentaDestinatarioService
  ) {}

  ngOnInit(): void {
    this.loadVentas();
    this.checkScreenSize();
    // Inicializar los elementos copiados desde localStorage
    this.initializeCopiedIcons();

  }

  initializeCopiedIcons(): void {
    this.dataSource.forEach(element => {
      if (localStorage.getItem(`copy_${element.id}`) === '1') {
        // Si en localStorage existe `copy_${id}` con valor '1', significa que se han copiado todos los campos
        this.copiedIcons[element.id!] = {
          nombre: true,
          cedula: true,
          cuenta: true,
          banco: true,
          bolivares: true
        };
      }
    });
  }

  // Método para copiar múltiples campos al portapapeles, incluyendo redondeo de bolívares
  copyDetailsToClipboard(element: any): void {
    // Extraer los valores requeridos
    const nombre = element.nombreCuentaDestinatario || '';
    const cedula = element.cedula || '';
    const cuenta = element.numeroCuenta || '';
    const bolivares = element.bolivares ? element.bolivares.toFixed(2) : ''; // Redondear a dos decimales

    // Concatenar en una sola cadena separada por comas
    const textToCopy = `${nombre},${cedula},${cuenta},${bolivares}`;

    // Copiar al portapapeles
    navigator.clipboard.writeText(textToCopy).then(() => {
      console.log('Texto copiado:', textToCopy);
      alert('Información copiada al portapapeles');
    }).catch(err => {
      console.error('Error al copiar el texto:', err);
      alert('Error al copiar el texto');
    });
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

    const dialogRef = this.dialog.open(ModalBancosComponent, {
      data: { ventaId: element.ventaBsId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.ventaBsService.updateBancoBs(result.ventaId, result.cuentaId).subscribe(
          response => {
            console.log('Venta actualizada con la cuenta bancaria seleccionada', response);
            this.loadVentas();
          },
          error => {
            console.error('Error al actualizar la venta con la cuenta bancaria seleccionada', error);
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

  confirmarVentaSalida(venta: CuentaDestinatario): void {
    const nombreCuenta = venta.nombreClienteFinal || 'N/A';

    if (nombreCuenta !== 'N/A') {
      navigator.clipboard.writeText(nombreCuenta).then(() => {
        // El nombre se copió exitosamente
        this.confirmarVentaSalidaProceso(venta, nombreCuenta, true);
      }).catch(err => {
        // No se pudo copiar el nombre al portapapeles
        console.error('Error al copiar el nombre de la cuenta al portapapeles', err);
        this.confirmarVentaSalidaProceso(venta, nombreCuenta, false);
      });
    } else {
      this.confirmarVentaSalidaProceso(venta, nombreCuenta, false);
    }
  }

  confirmarVentaSalidaProceso(venta: CuentaDestinatario, nombreCuenta: string, copiadoExitoso: boolean): void {
    const ventasAConfirmar: CuentaDestinatario[] = [venta];
    console.log(ventasAConfirmar)
    this.ventaBsService.confirmarVentaSalida(ventasAConfirmar).subscribe(
      response => {
        console.log('Venta confirmada', response);
        let mensajeTexto = `Mandar capture a: ${nombreCuenta}.`;
        if (copiadoExitoso && nombreCuenta !== 'N/A') {
          mensajeTexto += ' (Nombre copiado)';
        } else if (!copiadoExitoso && nombreCuenta !== 'N/A') {
          mensajeTexto += ' (No se pudo copiar el nombre al portapapeles)';
        }

        Swal.fire({
          title: 'Venta Confirmada',
          text: mensajeTexto,
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });

        localStorage.removeItem(`copy_${venta.id}`);
        this.loadVentas();

      },
      error => {
        console.error('Error al confirmar la venta', error);
        Swal.fire({
          title: 'Error',
          text: 'Ocurrió un error al confirmar la venta.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    );
  }

  pagoParcial(element: CuentaDestinatario): void {
    const dialogRef = this.dialog.open(PagoParcialComponent, {
      width: '300px',
      data: { cuenta: element }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // result contiene el monto ingresado
        this.cuentaDestinatarioService.pagoParcial(element.id!, result).subscribe(
          response => {
            console.log('Pago parcial realizado:', response);
            alert('Pago parcial realizado con éxito.');
          },
          error => {
            console.error('Error al realizar el pago parcial:', error);
            alert('Ocurrió un error al realizar el pago parcial.');
          }
        );
      }
    });
  }
  copyToClipboard(value: string | number, id: number, field: string): void {
    // Verificar si el ítem ya ha sido copiado completamente (valor de `copy` en `localStorage` es `1`)
    if (localStorage.getItem(`copy_${id}`) === '1') {
      alert('Ya has copiado toda la información de este elemento anteriormente');
    }

    if (this.isCopied(id, field)) {
      alert("Este texto ya ha sido copiado anteriormente");
      // No se detiene la ejecución para permitir copiado adicional
    }

    const formattedValue = typeof value === 'number' ? value.toFixed(2) : value;

    navigator.clipboard.writeText(formattedValue).then(() => {
      console.log('Texto copiado al portapapeles:', formattedValue);

      // Actualizar el estado para el elemento y campo copiado
      if (!this.copiedIcons[id]) {
        this.copiedIcons[id] = {};
      }
      this.copiedIcons[id][field] = true;
      console.log(`Campo ${field} del elemento con id ${id} marcado como copiado.`);

      // Verificar si todos los campos de este elemento han sido copiados
      const allFields = ['nombre', 'cedula', 'cuenta', 'bolivares']; // Ajusta los nombres según tus columnas
      const allCopied = allFields.every(fieldName => this.copiedIcons[id][fieldName]);

      if (allCopied) {
        // Guardar en localStorage la clave `copy` para este id
        localStorage.setItem(`copy_${id}`, '1');
        console.log(`Todos los campos del elemento con id ${id} han sido copiados. Guardado en localStorage.`);
      }
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
