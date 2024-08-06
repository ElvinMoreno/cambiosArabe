import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { AggSalidaComponent } from '../../../../formulario/agg-salida/agg-salida.component';
import { MatIconModule } from '@angular/material/icon';
import { RetiroService } from '../../../../../services/retiro.service';
import { Retiro } from '../../../../../interfaces/retiro';

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

    dialogRef.componentInstance.confirmar.subscribe((data: Retiro) => {
      console.log(data);
      this.dataSource.push(data); // Añadir nueva salida a la dataSource
      this.dataSource = [...this.dataSource]; // Actualizar dataSource
    });

    dialogRef.componentInstance.cancelar.subscribe(() => {
      dialogRef.close();
    });
  }
}
