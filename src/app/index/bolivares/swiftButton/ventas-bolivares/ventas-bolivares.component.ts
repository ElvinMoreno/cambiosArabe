import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BancolombiaComponent } from '../../../formulario/bancolombia/bancolombia.component';

@Component({
  selector: 'ventas-bolivares',
  standalone: true,
  imports: [MatButtonModule, MatTableModule, CommonModule,MatDialogModule],
  templateUrl: './ventas-bolivares.component.html',
  styleUrls: ['./ventas-bolivares.component.css']
})
export class VentasBolivaresComponent {
  ELEMENT_DATA = [
    { nombreCliente: 'Juan Perez', cuenta: '123456', transferenciaBolivares: 10000, conversion: 10.5, tasa: 1.2, detalles: 'Pago de servicio' },
    { nombreCliente: 'Maria Gomez', cuenta: '654321', transferenciaBolivares: 20000, conversion: 21.0, tasa: 1.1, detalles: 'Pago de producto' }
  ];

  displayedColumns: string[] = ['nombreCliente', 'cuenta', 'transferenciaBolivares', 'conversion', 'tasa', 'detalles'];
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
