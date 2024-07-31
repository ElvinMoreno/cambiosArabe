import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { BancolombiaComponent } from '../../../../formulario/bancolombia/bancolombia.component';
import { VentaBs } from '../../../../../interfaces/venta-bs';
import { VentaBsService } from '../../../../../services/venta-bs.service';

@Component({
  selector: 'ventas-bolivares',
  standalone: true,
  imports: [MatButtonModule, MatTableModule, CommonModule, MatDialogModule, MatIconModule],
  templateUrl: './ventas-bolivares.component.html',
  styleUrls: ['./ventas-bolivares.component.css']
})
export class VentasBolivaresComponent implements OnInit {
  displayedColumns: string[] = ['cuentaBs', 'cuentaCop', 'metodoPago', 'cliente', 'tasa', 'fecha', 'bolivares', 'pesos'];
  dataSource: VentaBs[] = [];

  constructor(public dialog: MatDialog, private ventaBsService: VentaBsService) {}

  ngOnInit(): void {
    this.loadVentas();
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

  openDialog(): void {
    const dialogRef = this.dialog.open(BancolombiaComponent, {
      width: '800px',
      data: {} // Si necesitas pasar datos al formulario, puedes hacerlo aquí
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.onConfirmar(result);
      }
    });
  }

  onConfirmar(event: VentaBs) {
    this.ventaBsService.saveVentaBs(event).subscribe(
      () => {
        this.loadVentas();
      },
      (error) => {
        console.error('Error al guardar la venta:', error);
      }
    );
  }
}
