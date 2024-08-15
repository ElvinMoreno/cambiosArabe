import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { CuentaBancariaService } from '../../../services/cuenta-bancaria.service';
import { CuentaBancaria } from '../../../interfaces/cuenta-bancaria';
import { VentaBsService } from '../../../services/venta-bs.service';
import { VentasCuentasComponent } from './ventas-cuentas/ventas-cuentas.component';

@Component({
  selector: 'app-confirmar-entrada',
  standalone: true,
  imports: [
    MatButtonModule,
    CommonModule,
    MatDialogModule,
    MatIconModule,
    MatCardModule
  ],
  templateUrl: './confirmar-entrada.component.html',
  styleUrls: ['./confirmar-entrada.component.css']
})
export class ConfirmarEntradaComponent implements OnInit {
  dataSource: CuentaBancaria[] = [];
  isMobile = false;

  constructor(
    public dialog: MatDialog,
    private cuentaBancariaService: CuentaBancariaService,
    private breakpointObserver: BreakpointObserver
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
      (data: CuentaBancaria[]) => {
        this.dataSource = data;
      },
      (error) => {
        console.error('Error al cargar las cuentas:', error);
      }
    );
  }

  openVentasCuentasDialog(cuentaBancariaId: number): void {
    this.dialog.open(VentasCuentasComponent, {
      data: { cuentaBancariaId }
    });
  }
}
