import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule, MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { CuentaBancariaService } from '../../../services/cuenta-bancaria.service';
import { CuentaBancaria } from '../../../interfaces/cuenta-bancaria';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { ConfirmarAccionComponent } from '../../../confirmar-accion/confirmar-accion.component';


@Component({
  selector: 'app-actualizar-cuenta-bancaria',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule
  ],
  templateUrl: './actualizar-cuenta-bancaria.component.html',
  styleUrls: ['./actualizar-cuenta-bancaria.component.css']
})
export class ActualizarCuentaBancariaComponent implements OnInit {
  form: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private cuentaBancariaService: CuentaBancariaService,
    public dialogRef: MatDialogRef<ActualizarCuentaBancariaComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: { cuentaBancaria: CuentaBancaria }
  ) {
    this.form = this.fb.group({
      id: [{ value: data.cuentaBancaria.id, disabled: true }],
      nombreBanco: [{ value: data.cuentaBancaria.nombreBanco, disabled: true }],
      nombreCuenta: [{ value: data.cuentaBancaria.nombreCuenta, disabled: true }],
      monto: [data.cuentaBancaria.monto, [Validators.required, Validators.min(0)]],
      limiteCB: [data.cuentaBancaria.limiteCB, [Validators.required, Validators.min(0)]],
      limiteMonto: [data.cuentaBancaria.limiteMonto, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.form.valid) {
      const dialogRef = this.dialog.open(ConfirmarAccionComponent, {
        width: '300px',
        data: {
          accion: 'Actualizar Datos de la Cuenta',
          message: '¿Estás seguro de que deseas actualizar la cuenta bancaria?'
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.onConfirmar();
        }
      });
    }
  }

  onConfirmar(): void {
    if (this.form.valid) {
      this.isLoading = true;
      this.errorMessage = null;
      const updatedCuenta: CuentaBancaria = {
        ...this.data.cuentaBancaria,
        ...this.form.getRawValue()
      };

      this.cuentaBancariaService.updateCuentaBancaria(updatedCuenta.id, updatedCuenta)
        .pipe(
          catchError(error => {
            console.error('Error al actualizar la cuenta bancaria:', error);
            this.errorMessage = 'Ocurrió un error al actualizar la cuenta bancaria. Por favor, inténtalo de nuevo.';
            return of(null);
          }),
          finalize(() => this.isLoading = false)
        )


        .subscribe(
          result => {
            if (result !== null) {
              this.dialogRef.close(true);
            }
          }
        );
        console.log(updatedCuenta);
    }
  }

  onCancelar(): void {
    this.dialogRef.close();
  }
}
