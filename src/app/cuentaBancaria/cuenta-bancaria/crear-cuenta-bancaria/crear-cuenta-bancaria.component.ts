import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CuentaBancariaService } from '../../../services/cuenta-bancaria.service';
import { BancosService } from '../../../services/banco.service';
import { Bancos } from '../../../interfaces/bancos';
import { CuentaBancaria } from '../../../interfaces/cuenta-bancaria';
import { catchError, finalize, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-crear-cuenta-bancaria',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
  ],
  templateUrl: './crear-cuenta-bancaria.component.html',
  styleUrls: ['./crear-cuenta-bancaria.component.css']
})
export class CrearCuentaBancariaComponent implements OnInit {
  form: FormGroup;
  bancos: Bancos[] = [];
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private cuentaBancariaService: CuentaBancariaService,
    private bancosService: BancosService,
    public dialogRef: MatDialogRef<CrearCuentaBancariaComponent>
  ) {
    this.form = this.fb.group({
      bancoSeleccionado: ['', Validators.required],
      nombreCuenta: ['', Validators.required],
      monto: [0, [Validators.required, Validators.min(0)]],
      numCuenta: [0, Validators.required],
      limiteCB: [0, [Validators.required, Validators.min(0)]],
      limiteMonto: [0, [Validators.required, Validators.min(0)]],
      responsable: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadBancosColombianos();
  }

  loadBancosColombianos() {
    this.bancosService.getBancosColombianos()
      .pipe(
        catchError(error => {
          console.error('Error al cargar los bancos colombianos:', error);
          this.errorMessage = 'Ocurrió un error al cargar los bancos colombianos. Por favor, inténtalo de nuevo.';
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
        nombreBanco: formValue.bancoSeleccionado,
        nombreCuenta: formValue.nombreCuenta,
        monto: formValue.monto,
        numCuenta: formValue.numCuenta,
        limiteCB: formValue.limiteCB,
        limiteMonto: formValue.limiteMonto,
        responsabe: formValue.responsable  // Corregido el nombre de la propiedad aquí
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
