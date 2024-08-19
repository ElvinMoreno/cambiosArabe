import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

interface DialogConfig {
  data: any;
  title?: string;
  fields: { label: string; key: string; format?: string }[];
  showCloseButton?: boolean;
  closeButtonLabel?: string;
}

@Component({
  selector: 'app-detalle-movimiento-comp-gen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detalle-movimiento-comp-gen.component.html',
  styleUrls: ['./detalle-movimiento-comp-gen.component.css']
})
export class DetalleMovimientoCompGenComponent {
  title: string;
  fields: { label: string; key: string; format?: string }[];
  showCloseButton: boolean;
  closeButtonLabel: string;

  constructor(
    public dialogRef: MatDialogRef<DetalleMovimientoCompGenComponent>,
    @Inject(MAT_DIALOG_DATA) public config: DialogConfig
  ) {
    this.title = config.title || 'Detalles';
    this.fields = config.fields;
    this.showCloseButton = config.showCloseButton !== false;
    this.closeButtonLabel = config.closeButtonLabel || 'Cerrar';
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
