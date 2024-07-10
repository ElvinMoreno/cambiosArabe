import { Component, EventEmitter, Output, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-bancolombia',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatIconModule
  ],
  templateUrl: './bancolombia.component.html',
  styleUrls: ['./bancolombia.component.css'],
})
export class BancolombiaComponent {
  @Output() cancelar = new EventEmitter<void>();
  @Output() confirmar = new EventEmitter<any>();

  form: FormGroup;
  currentLabel = 'Cantidad bolívares';
  currentType = 'number';

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<BancolombiaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      nombreCuenta: ['', Validators.required],
      fecha: ['', Validators.required],
      cuentaBs: ['', Validators.required],
      tipoPago: ['', Validators.required],
      conversionAutomatica: ['', Validators.required],
      comision: ['', Validators.required],
      celular: ['', Validators.required],
      cliente: ['', Validators.required],
      cuentaPesos: ['', Validators.required],
      cantidad: ['', Validators.required],
      tasa: ['', Validators.required],
      cedula: ['', Validators.required]
    });
  }

  toggleCantidad() {
    if (this.currentLabel === 'Cantidad bolívares') {
      this.currentLabel = 'Cantidad pesos';
    } else {
      this.currentLabel = 'Cantidad bolívares';
    }
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
