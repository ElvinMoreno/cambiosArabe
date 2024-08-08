import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CuentaBancariaService } from '../../../services/cuenta-bancaria.service';
import { BancosService } from '../../../services/banco.service';
import { Bancos } from '../../../interfaces/bancos';
import { CuentaBancaria } from '../../../interfaces/cuenta-bancaria';
import { catchError, finalize, of } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-crear-cuenta-bancaria-v',
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
  templateUrl: './crear-cuenta-bancaria-v.component.html',
  styleUrls: ['./crear-cuenta-bancaria-v.component.css']
})
export class CrearCuentaBancariaVComponent implements OnInit {
  form: FormGroup;
  bancos: Bancos[] = [];
  otroBancoSeleccionado = false;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private cuentaBancariaService: CuentaBancariaService,
    private bancosService: BancosService,
    public dialogRef: MatDialogRef<CrearCuentaBancariaVComponent>
  ) {
    this.form = this.fb.group({
      bancoSeleccionado: [null, Validators.required],
      otroBanco: [''],
      nombreCuenta: ['', Validators.required],
      monto: [0, [Validators.required, Validators.min(0)]],
      numCuenta: [0, Validators.required],
      limiteCB: [null, [Validators.required, Validators.min(0)]],
      limiteMonto: [null, [Validators.required, Validators.min(0)]],
      responsable: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadBancosVenezolanos();

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

  loadBancosVenezolanos() {
    this.bancosService.getBancosVenezolanos()
      .pipe(
        catchError(error => {
          console.error('Error al cargar los bancos venezolanos:', error);
          this.errorMessage = 'Ocurrió un error al cargar los bancos venezolanos. Por favor, inténtalo de nuevo.';
          return of([]);
        })
      )
      .subscribe(data => {
        this.bancos = data;
      });
  }

  onConfirmar(): void {
    if (this.form.valid) {
      this.isLoading = true;
      this.errorMessage = null;

      const formValue = this.form.getRawValue();

      const nuevaCuenta: CuentaBancaria = {
        id: 0,  // Se asume que el ID será generado por el backend
        nombreBanco: this.otroBancoSeleccionado ? formValue.otroBanco : formValue.bancoSeleccionado,
        nombreCuenta: formValue.nombreCuenta,
        monto: formValue.monto,
        numCuenta: formValue.numCuenta,
        limiteCB: formValue.limiteCB,
        limiteMonto: formValue.limiteMonto,
        responsabe: formValue.responsable
      };

      console.log('Datos enviados:', nuevaCuenta);  // Log para verificar los datos enviados

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
