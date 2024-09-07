import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { ConfirmarEntradaComponent } from './confirmar-entrada/confirmar-entrada.component';
import { ConfirmarSalidaComponent } from './confirmar-salida/confirmar-salida.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { VentaPagos } from '../../interfaces/venta-pagos';
import { VentaBsService } from '../../services/venta-bs.service';
import { CuentaDestinatario } from '../../interfaces/cuenta-destinatario';

@Component({
  selector: 'app-confirmar',
  standalone: true,
  imports: [
    MatButtonModule,
    CommonModule,
    MatTabsModule,
    ConfirmarEntradaComponent,
    ConfirmarSalidaComponent
  ],
  templateUrl: './confirmar.component.html',
  styleUrls: ['./confirmar.component.css']
})
export class ConfirmarComponent {
  vistaActual: 'entradas' | 'salidas' = 'entradas';
  dataSource: CuentaDestinatario[] = [];
  selectedIndex: number = 0;
  totalBolivares: number = 0;

  constructor(private router: Router,
    public dialog: MatDialog,
    private ventaBsService: VentaBsService,
  ) {}

  ngOnInit() {
    this.totalBolivares = this.loadVentas();
  }

  loadVentas(): number {
    let totalBolivares = 0;
    this.ventaBsService.getVentasSalidas().subscribe(
      (data: CuentaDestinatario[]) => {
        this.dataSource = data;
        totalBolivares = data.reduce((sum, venta) => sum + venta.bolivares, 0);
        this.totalBolivares = totalBolivares;  // Asigna el total de bolívares a la propiedad
        console.log('Total Bolívares Enviar:', totalBolivares);
      },
      (error) => {
        console.error('Error al cargar las ventas:', error);
      }
    );
    return totalBolivares;
  }

  cambiarVista(index: number) {
    const vistas = ['entradas', 'salidas'];
    this.vistaActual = vistas[index] as 'entradas' | 'salidas';
  }
}
