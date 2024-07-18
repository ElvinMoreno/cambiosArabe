import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmar-accion',
  templateUrl: './confirmar-accion.component.html',
  styleUrls: ['./confirmar-accion.component.css']
})
export class ConfirmarAccionComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmarAccionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
