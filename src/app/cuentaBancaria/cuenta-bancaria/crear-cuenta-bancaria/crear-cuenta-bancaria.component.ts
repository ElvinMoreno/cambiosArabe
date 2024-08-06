import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CuentaBancariaService } from '../../../services/cuenta-bancaria.service';
import { CuentaBancaria } from '../../../interfaces/cuenta-bancaria';
import { TipoCuentaBancaria } from '../../../interfaces/tipo-cuenta-bancaria';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { catchError, finalize, of } from 'rxjs';
import { TipoCuentaBancariaService } from '../../../services/tipo-de-cuenta-bancaria.service';

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
  tiposCuenta: TipoCuentaBancaria[] = [];
  isLoading = false;
  errorMessage: string | null = null;
  tipoCuentaPesos: TipoCuentaBancaria | null = null;

  constructor(
    private fb: FormBuilder,
    private cuentaBancariaService: CuentaBancariaService,
    private tipoCuentaBancariaService: TipoCuentaBancariaService,
    public dialogRef: MatDialogRef<CrearCuentaBancariaComponent>
  ) {
    this.form = this.fb.group({
      tipocuenta: [{ value: null, disabled: true }, Validators.required],
      bancoSeleccionado: ['', Validators.required],
      nombreCuenta: ['', Validators.required],
      monto: [0, [Validators.required, Validators.min(0)]],
      numCuenta: [0, Validators.required],
      limiteCB: [0, [Validators.required, Validators.min(0)]],
      limiteMonto: [0, [Validators.required, Validators.min(0)]],
      responsable: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadTiposCuentaBancaria();
  }

  loadTiposCuentaBancaria(): void {
    this.tipoCuentaBancariaService.getAllTiposCuentaBancaria().subscribe(
      (data: TipoCuentaBancaria[]) => {
        this.tiposCuenta = data;
        this.tipoCuentaPesos = this.tiposCuenta.find(tipo => tipo.divisa === 'Pesos') || null;
        if (this.tipoCuentaPesos) {
          this.form.patchValue({ tipocuenta: this.tipoCuentaPesos });
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
      const formValue = this.form.getRawValue();

      console.log('Valor del formulario:', formValue);

      const nuevaCuenta: CuentaBancaria = {
        id: 0,  // Se asume que el ID será generado por el backend
        tipocuenta: formValue.tipocuenta,
        nombreBanco: formValue.bancoSeleccionado,
        nombreCuenta: formValue.nombreCuenta,
        monto: formValue.monto,
        numCuenta: formValue.numCuenta,
        limiteCB: formValue.limiteCB,
        limiteMonto: formValue.limiteMonto,
        responsabe: formValue.responsable  // Agregar el responsable aquí
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