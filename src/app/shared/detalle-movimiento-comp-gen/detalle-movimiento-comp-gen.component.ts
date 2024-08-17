import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MovimientoDiaDTO } from '../../interfaces/MovimientoDiaDTO'; // Asegúrate de que la ruta sea correcta

@Component({
  selector: 'app-detalle-movimiento-comp-gen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detalle-movimiento-comp-gen.component.html',
  styleUrls: ['./detalle-movimiento-comp-gen.component.css'] // Corrige la propiedad `styleUrls`
})
export class DetalleMovimientoCompGenComponent {
  constructor(
    public dialogRef: MatDialogRef<DetalleMovimientoCompGenComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MovimientoDiaDTO
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }
}
