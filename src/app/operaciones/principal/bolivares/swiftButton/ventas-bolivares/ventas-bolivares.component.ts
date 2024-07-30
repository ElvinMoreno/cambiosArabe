import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BancolombiaComponent } from '../../../../formulario/bancolombia/bancolombia.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'ventas-bolivares',
  standalone: true,
  imports: [MatButtonModule, MatTableModule, CommonModule, MatDialogModule, MatIconModule],
  templateUrl: './ventas-bolivares.component.html',
  styleUrls: ['./ventas-bolivares.component.css']
})
export class VentasBolivaresComponent {
  ELEMENT_DATA = [
    { cuentaBs: 'Banco Venezuela', cuentaCop: 'Banco Colombia', metodoPago: 'Transferencia', cliente: 'Juan Perez', tasa: 1.2, fecha: new Date(), bolivares: 10000, pesos: 10500 },
    { cuentaBs: 'Banco Banesco', cuentaCop: 'Banco Davivienda', metodoPago: 'Efectivo', cliente: 'Maria Gomez', tasa: 1.1, fecha: new Date(), bolivares: 20000, pesos: 21000 }
  ];

  displayedColumns: string[] = ['cuentaBs', 'cuentaCop', 'metodoPago', 'cliente', 'tasa', 'fecha', 'bolivares', 'pesos'];
  dataSource = this.ELEMENT_DATA;

  constructor(public dialog: MatDialog) {}

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

  onConfirmar(event: any) {
    this.ELEMENT_DATA.push(event);
    this.dataSource = [...this.ELEMENT_DATA];
  }
}
