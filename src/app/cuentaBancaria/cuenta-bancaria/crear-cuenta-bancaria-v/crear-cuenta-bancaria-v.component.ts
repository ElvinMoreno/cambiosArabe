import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TipoCuentaBancaria } from '../../../interfaces/tipo-cuenta-bancaria';
import { CuentaBancariaService } from '../../../services/cuenta-bancaria.service';
import { TipoCuentaBancariaService } from '../../../services/tipo-de-cuenta-bancaria.service';
import { CrearCuentaBancariaComponent } from '../crear-cuenta-bancaria/crear-cuenta-bancaria.component';
import { MatDialogRef } from '@angular/material/dialog';
import { CuentaBancaria } from '../../../interfaces/cuenta-bancaria';
import { catchError, finalize, of } from 'rxjs';

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
  styleUrl: './crear-cuenta-bancaria-v.component.css'
})
export class CrearCuentaBancariaVComponent implements OnInit {
  form: FormGroup;
  tiposCuenta: TipoCuentaBancaria[] = [];
  bancos = [
    'Banco de Venezuela',
    'BBVA',
    'Banesco',
    'Banco Mercantil'
  ];
  otroBancoSeleccionado = false;
  isLoading = false;
  errorMessage: string | null = null;
  selectedTipoCuenta: string = '';

  constructor(
    private fb: FormBuilder,
    private cuentaBancariaService: CuentaBancariaService,
    private tipoCuentaBancariaService: TipoCuentaBancariaService,
    public dialogRef: MatDialogRef<CrearCuentaBancariaComponent>
  ) {
    this.form = this.fb.group({
      tipocuenta: [{ value: null, disabled: true }, Validators.required],
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
    this.loadTiposCuentaBancaria();

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

  loadTiposCuentaBancaria(): void {
    this.tipoCuentaBancariaService.getAllTiposCuentaBancaria().subscribe(
      (data: TipoCuentaBancaria[]) => {
        this.tiposCuenta = data;
        const bolivaresTipoCuenta = this.tiposCuenta.find(tipo => tipo.divisa === 'Bolivares');
        if (bolivaresTipoCuenta) {
          this.form.patchValue({ tipocuenta: bolivaresTipoCuenta.nombre });
          this.selectedTipoCuenta = `${bolivaresTipoCuenta.nombre} - ${bolivaresTipoCuenta.divisa}`;
        }
      },
      (error) => {
        console.error('Error al cargar los tipos de cuenta bancaria', error);
      }
    );
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
        divisa: formValue.tipocuenta.divisa,
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
