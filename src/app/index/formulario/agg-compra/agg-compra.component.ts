import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-agg-compra',
  standalone: true,
  imports: [],
  templateUrl: './agg-compra.component.html',
  styleUrl: './agg-compra.component.css'
})
export class AggCompraComponent {
  @Output() cancelar = new EventEmitter<void>();
  @Output() confirmar = new EventEmitter<any>();

  form: FormGroup;
  currentLabel = 'Cantidad bolívares';
  currentType = 'number';

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AggCompraComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      nombreCuenta: ['', Validators.required],
      fecha: ['', Validators.required],
      tipoCuenta: ['', Validators.required],
      tipoPago: ['', Validators.required],
      Tasa: ['', Validators.required],
      conversionAutomatico: ['', Validators.required],
      cantidadBolivares: ['', Validators.required]
    });
  }



  onConfirmar() {
    if (this.form.valid) {
      this.confirmar.emit(this.form.value);
      this.dialogRef.close(this.form.value); // Close the dialog with the form value
    }
  }

  onCancelar() {
    this.cancelar.emit();
    this.dialogRef.close(); // Close the dialog without returning any value
  }
}
