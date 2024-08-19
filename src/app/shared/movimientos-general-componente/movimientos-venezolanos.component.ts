import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MovimientoService } from '../../services/movimiento.service';
import { MovimientoDiaDTO } from '../../interfaces/MovimientoDiaDTO';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DetalleMovimientoCompGenComponent } from '../detalle-movimiento-comp-gen/detalle-movimiento-comp-gen.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-movimientos-venezolanos',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './movimientos-venezolanos.component.html',
  styleUrls: ['./movimientos-venezolanos.component.css']
})

export class MovimientosVenezolanosComponent implements OnInit {
  movimientos: MovimientoDiaDTO[] = [];
  nombreCuentaBancaria: string = '';
  esCuentaColombiana: boolean = false;  // Nueva propiedad para identificar el tipo de cuenta

  constructor(
    private movimientoService: MovimientoService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.esCuentaColombiana = params['esColombiana'] === 'true';
      const cuentaId = Number(this.route.snapshot.paramMap.get('cuentaId'));
      if (cuentaId) {
        this.loadMovimientos(cuentaId);
      }
    });
  }

  loadMovimientos(cuentaId: number): void {
    this.movimientoService.getMovimientos(cuentaId).subscribe(
      (data: MovimientoDiaDTO[]) => {
        this.movimientos = data.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
        if (data.length > 0) {
          this.nombreCuentaBancaria = data[0].nombreCuentaBancaria;
        }
      },
      error => {
        console.error('Error al obtener los movimientos:', error);
      }
    );
  }

  openDialog(movimiento: MovimientoDiaDTO): void {
    this.dialog.open(DetalleMovimientoCompGenComponent, {
      width: '400px',
      data: {
        title: 'Detalles del Movimiento',
        data: movimiento,
        fields: [
          { label: 'Fecha', key: 'fecha', format: 'date' },
          { label: 'Tipo de Movimiento', key: 'tipoMovimiento' },
          { label: 'Monto', key: 'monto', format: 'currency' },
          { label: 'Descripción', key: 'descripcion' },
          { label: 'Cuenta Bancaria', key: 'nombreCuentaBancaria' },
          { label: 'Entrada', key: 'entrada' }
        ],
        showCloseButton: true,
        closeButtonLabel: 'Cerrar'
      }
    });
  }

  goBack(): void {
    if (this.esCuentaColombiana) {
      this.router.navigate(['/operaciones/cuentaBancaria'], { queryParams: { tab: 0, subTab: 1 } });
    } else {
      this.router.navigate(['/operaciones/cuentaBancaria'], { queryParams: { tab: 1 } });
    }
  }

  isToday(dateString: string): boolean {
    const date = new Date(dateString);
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }
}
