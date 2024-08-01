import { Component } from '@angular/core';
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

@Component({
  selector: 'app-confirmar-entrada',
  standalone: true,
  imports: [MatButtonModule,
    MatTableModule, CommonModule, MatDialogModule,
    MatIconModule, MatCardModule
  ],
  templateUrl: './confirmar-entrada.component.html',
  styleUrl: './confirmar-entrada.component.css'
})
export class ConfirmarEntradaComponent {
  displayedColumns: string[] = ['cuentaBs', 'cuentaCop', 'metodoPago', 'cliente', 'tasa', 'fecha', 'bolivares', 'pesos'];
  dataSource: VentaBs[] = [];
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
    this.ventaBsService.getAllVentasBs().subscribe(
      (data: VentaBs[]) => {
        this.dataSource = data;
      },
      (error) => {
        console.error('Error al cargar las ventas:', error);
      }
    );
  }

  openConfirmDialog(element: VentaBs): void {
    const dialogRef = this.dialog.open(ConfirmarAccionComponent, {
      data: {
        message: `Desea confirmar ${element.precio} que ha recibido  en la cuenta
        ${element.cuentaBancariaPesos.nombreBanco}`,
        accion: 'Entrada'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Acción confirmada');
      } else {
        console.log('Acción cancelada');
      }
    });
  }
}
