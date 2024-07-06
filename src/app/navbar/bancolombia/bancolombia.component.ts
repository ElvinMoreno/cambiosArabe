import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-bancolombia',
  standalone: true,
  imports: [CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule],
  templateUrl: './bancolombia.component.html',
  styleUrl: './bancolombia.component.css'
})
export class BancolombiaComponent {form: FormGroup;

  constructor(private fb: FormBuilder) {
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
      cantidadBolivares: ['', Validators.required],
      tasa: ['', Validators.required],
      cedula: ['', Validators.required]
    });
  }

  confirmarVenta() {
    if (this.form.valid) {
      console.log(this.form.value);
    }
  }

  cancelar() {
    this.form.reset();
  }

}
