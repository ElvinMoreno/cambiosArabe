import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CuentaBancariaService } from '../../../services/cuenta-bancaria.service';
import { CuentaBancaria } from '../../../interfaces/cuenta-bancaria';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { catchError, finalize, of } from 'rxjs';

@Component({
  selector: 'app-crear-cuenta-bancaria',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatIconModule,
  ],
  templateUrl: './crear-cuenta-bancaria.component.html',
  styleUrls: ['./crear-cuenta-bancaria.component.css']
})
export class CrearCuentaBancariaComponent implements OnInit {
  form: FormGroup;
  tiposCuenta = [
    { id: 1, nombre: 'Pesos', divisa: 'Pesos' },
    { id: 2, nombre: 'Bolívar', divisa: 'Bolívar' }
  ];
  bancos = [
    'Banco de Venezuela',
    'BBVA',
    'Banesco',
    'Banco Mercantil'
  ];
  otroBancoSeleccionado = false;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private cuentaBancariaService: CuentaBancariaService,
    public dialogRef: MatDialogRef<CrearCuentaBancariaComponent>
  ) {
    this.form = this.fb.group({
      tipocuenta: [null, Validators.required],
      bancoSeleccionado: [null, Validators.required],
      otroBanco: [''],
      nombreCuenta: ['', Validators.required],
      monto: [0, [Validators.required, Validators.min(0)]],
      numCuenta: [0, Validators.required],
      limiteCB: [0, [Validators.required, Validators.min(0)]],
      limiteMonto: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.form.get('bancoSeleccionado')?.valueChanges.subscribe(value => {
      this.otroBancoSeleccionado = value === 'Otro';
      if (this.otroBancoSeleccionado) {
        this.form.get('otroBanco')?.setValidators([Validators.required]);
      } else {
        this.form.get('otroBanco')?.clearValidators();
      }
      this.form.get('otroBanco')?.updateValueAndValidity();
    });
  }

  onConfirmar(): void {
    if (this.form.valid) {
      this.isLoading = true;
      this.errorMessage = null;
      const formValue = this.form.value;

      const nuevaCuenta: CuentaBancaria = {
        id: 0,  // Se asume que el ID será generado por el backend
        tipocuenta: formValue.tipocuenta,
        nombreBanco: this.otroBancoSeleccionado ? formValue.otroBanco : formValue.bancoSeleccionado,
        nombreCuenta: formValue.nombreCuenta,
        monto: formValue.monto,
        numCuenta: formValue.numCuenta,
        limiteCB: formValue.limiteCB,
        limiteMonto: formValue.limiteMonto,
        divisa: formValue.tipocuenta.divisa
      };

      this.cuentaBancariaService.createCuentaBancaria(nuevaCuenta)
        .pipe(
          catchError(error => {
            console.error('Error al crear la cuenta bancaria:', error);
            this.errorMessage = 'Ocurrió un error al crear la cuenta bancaria. Por favor, inténtalo de nuevo.';
            return of(null);
          }),
          finalize(() => this.isLoading = false)
        )
        .subscribe(result => {
          if (result !== null) {
            this.dialogRef.close(true);
          }
        });
    }
  }

  onCancelar(): void {
    this.dialogRef.close();
  }
}
