import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MovimientoService } from '../../services/movimiento.service';
import { MovimientoDiaDTO } from '../../interfaces/MovimientoDiaDTO';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MovimientosTableComponent } from '../../shared/movimientos-table/movimientos-table.component'; // Importa MovimientosTableComponent

@Component({
  selector: 'app-movimientos-venezolanos',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MovimientosTableComponent,
    MatIcon // Asegúrate de importar MovimientosTableComponent
  ],
  templateUrl: './movimientos-venezolanos.component.html',
  styleUrls: ['./movimientos-venezolanos.component.css']
})
export class MovimientosVenezolanosComponent implements OnInit {
  movimientos: MovimientoDiaDTO[] = [];
  nombreCuentaBancaria: string = '';
  esCuentaColombiana: boolean = false;

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

  goBack(): void {
    if (this.esCuentaColombiana) {
      this.router.navigate(['/operaciones/cuentaBancaria'], { queryParams: { tab: 0, subTab: 1 } });
    } else {
      this.router.navigate(['/operaciones/cuentaBancaria'], { queryParams: { tab: 1 } });
    }
  }
}
