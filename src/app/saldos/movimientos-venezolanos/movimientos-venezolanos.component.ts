import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MovimientoService } from '../../services/movimiento.service';
import { MovimientoDiaDTO } from '../../interfaces/MovimientoDiaDTO';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-movimientos-venezolanos',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule
  ],
  templateUrl: './movimientos-venezolanos.component.html',
  styleUrls: ['./movimientos-venezolanos.component.css']
})
export class MovimientosVenezolanosComponent implements OnInit {
  displayedColumns: string[];
  dataSource = new MatTableDataSource<MovimientoDiaDTO>();

  constructor(
    private movimientoService: MovimientoService,
    @Inject(MAT_DIALOG_DATA) public data: { cuentaId: number }
  ) {
    this.displayedColumns = ['fecha', 'descripcion', 'monto']; // Definir en el constructor
  }

  ngOnInit(): void {
    this.loadMovimientos();
  }

  loadMovimientos(): void {
    this.movimientoService.getMovimientosVenezolanas(this.data.cuentaId).subscribe(
      (data: MovimientoDiaDTO[]) => {
        console.log('Movimientos recibidos:', data);
        this.dataSource.data = data;
      },
      error => {
        console.error('Error al obtener los movimientos:', error);
      }
    );
  }
}
