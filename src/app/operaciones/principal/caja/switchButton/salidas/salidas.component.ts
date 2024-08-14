import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { AggSalidaComponent } from '../../../../formulario/agg-salida/agg-salida.component';
import { MatIconModule } from '@angular/material/icon';
import { Retiro } from '../../../../../interfaces/retiro';
import { RetiroService } from '../../../../../services/retiro.service';

@Component({
  selector: 'salidas',
  standalone: true,
  imports: [
    MatButtonModule,
    MatTableModule,
    CommonModule,
    MatIconModule
  ],
  templateUrl: './salidas.component.html',
  styleUrls: ['./salidas.component.css']
})
export class SalidasComponent implements OnInit {
  displayedColumns: string[] = ['fecha', 'cuenta', 'monto'];
  dataSource: Retiro[] = [];

  constructor(public dialog: MatDialog, private retiroService: RetiroService) {}

  ngOnInit(): void {
    this.loadRetiros();
  }

  loadRetiros(): void {
    this.retiroService.getAllRetiros().subscribe(
      (data: Retiro[]) => {
        this.dataSource = data;
      },
      (error) => {
        console.error('Error al cargar los retiros', error);
      }
    );
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AggSalidaComponent, {
      width: '600px'
    });

    // Manejar el cierre del diálogo
    dialogRef.afterClosed().subscribe(result => {
      // Recargar las salidas (retiros) después de cerrar el diálogo
      this.loadRetiros();
    });
  }
}
