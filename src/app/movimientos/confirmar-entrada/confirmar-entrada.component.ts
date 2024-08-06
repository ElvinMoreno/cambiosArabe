import { Component, OnInit } from '@angular/core';
import { VentaBs } from '../../interfaces/venta-bs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { VentaBsService } from '../../services/venta-bs.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { ConfirmarAccionComponent } from '../../confirmar-accion/confirmar-accion.component';
import { VentaPagos } from '../../interfaces/venta-pagos';

@Component({
  selector: 'app-confirmar-entrada',
  standalone: true,
  imports: [
    MatButtonModule,
    MatTableModule,
    CommonModule,
    MatDialogModule,
    MatIconModule,
    MatCardModule
  ],
  templateUrl: './confirmar-entrada.component.html',
  styleUrls: ['./confirmar-entrada.component.css']
})
export class ConfirmarEntradaComponent implements OnInit {
  displayedColumns: string[] = ['cuentaCop', 'metodoPago', 'cliente', 'tasa', 'fecha', 'bolivares', 'pesos'];
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
    this.ventaBsService.getVentasEntradas().subscribe(
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
        message: `Desea confirmar ${element.pesosRecibidos} que ha recibido  en la cuenta ${element.nombreCuentaCop}`,
        accion: 'Entrada',
        venta: element
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.confirmarVentaEntrada(result);
      }
    });
  }

  confirmarVentaEntrada(venta: VentaPagos): void {
    this.ventaBsService.confirmarVentaEntrada(venta).subscribe(
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
