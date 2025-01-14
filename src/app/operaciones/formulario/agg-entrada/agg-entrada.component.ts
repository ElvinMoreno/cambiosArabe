import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-agg-entrada',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule
  ],
  templateUrl: './agg-entrada.component.html',
  styleUrls: ['./agg-entrada.component.css']
})
export class AggEntradaComponent {
  @Output() cancelar = new EventEmitter<void>();
  @Output() confirmar = new EventEmitter<any>();

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AggEntradaComponent>
  ) {
    this.form = this.fb.group({
      monto: ['', Validators.required],
      fecha: ['', Validators.required],
      metodoPago: ['', Validators.required],
      origen: ['', Validators.required],
      descripcion: ['', Validators.required]
    });
  }

  onConfirmar() {
    if (this.form.valid) {
      this.confirmar.emit(this.form.value);
      this.dialogRef.close();
    }
  }

        onCancelar() {
          this.cancelar.emit();
          this.dialogRef.close();
        }
}
