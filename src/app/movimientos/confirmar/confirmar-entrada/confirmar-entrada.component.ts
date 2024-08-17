import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { CuentaBancariaService } from '../../../services/cuenta-bancaria.service';
import { CuentaBancaria } from '../../../interfaces/cuenta-bancaria';
import { VentasCuentasComponent } from './ventas-cuentas/ventas-cuentas.component';
import { VentaPagos } from '../../../interfaces/venta-pagos';
import { forkJoin, map } from 'rxjs';
import { VentaBsService } from '../../../services/venta-bs.service';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  selector: 'app-confirmar-entrada',
  standalone: true,
  imports: [
    MatButtonModule,
    CommonModule,
    MatDialogModule,
    MatIconModule,
    MatCardModule,
    MatBadgeModule
  ],
  templateUrl: './confirmar-entrada.component.html',
  styleUrls: ['./confirmar-entrada.component.css']
})
export class ConfirmarEntradaComponent implements OnInit {
  dataSource: any[] = []; // Incluye los datos de las cuentas y las ventas
  isMobile = false;

  constructor(
    public dialog: MatDialog,
    private cuentaBancariaService: CuentaBancariaService,
    private breakpointObserver: BreakpointObserver,
    private ventaBsService: VentaBsService
  ) {}

  ngOnInit(): void {
    this.loadCuentas();
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.breakpointObserver.observe([Breakpoints.Handset])
      .subscribe(result => {
        this.isMobile = result.matches;
      });
  }

  loadCuentas(): void {
    this.cuentaBancariaService.getCuentasColombianas().subscribe(
      (cuentas: CuentaBancaria[]) => {
        const cuentasProcesadas = cuentas.map(cuenta => {
          return this.ventaBsService.getVentasEntradas(cuenta.id!).pipe(
            map((ventas: VentaPagos[] | null) => {
              const totalPesosRecibidos = ventas ? ventas.reduce((sum, venta) => sum + venta.pesosRecibidos, 0) : 0;
              const totalVentas = ventas ? ventas.length : 0; // Contar la cantidad de ventas
              return { ...cuenta, monto: cuenta.monto! + totalPesosRecibidos, totalVentas }; // Añadir totalVentas
            })
          );
        });

        forkJoin(cuentasProcesadas).subscribe(
          cuentasFinales => {
            // Filtrar cuentas que tienen totalVentas >= 1
            this.dataSource = cuentasFinales.filter(cuenta => cuenta.totalVentas >= 1);
          },
          (error) => {
            console.error('Error al procesar las cuentas:', error);
          }
        );
      },
      (error) => {
        console.error('Error al cargar las cuentas:', error);
      }
    );
  }

  openVentasCuentasDialog(cuentaBancariaId: number): void {
    const dialogRef = this.dialog.open(VentasCuentasComponent, {
      data: { cuentaBancariaId }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadCuentas(); // Recargar las cuentas bancarias al cerrar el diálogo
    });
  }
}
