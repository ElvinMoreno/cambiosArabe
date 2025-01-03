import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pago-parcial',
  template: `
    <h2 mat-dialog-title>Pago Parcial</h2>
    <mat-dialog-content>
      <form [formGroup]="pagoParcialForm">
        <mat-form-field appearance="fill">
          <mat-label>Monto a pagar</mat-label>
          <input matInput formControlName="monto" type="number" placeholder="Ingrese el monto">
          <mat-error *ngIf="pagoParcialForm.get('monto')?.hasError('required')">
            El monto es obligatorio
          </mat-error>
          <mat-error *ngIf="pagoParcialForm.get('monto')?.hasError('min')">
            El monto debe ser mayor a 0
          </mat-error>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="cancelar()">Cancelar</button>
      <button mat-raised-button color="primary" (click)="confirmarPagoParcial()" [disabled]="pagoParcialForm.invalid">
        Confirmar
      </button>
    </mat-dialog-actions>
  `,
  standalone: true,
  imports: [ MatDialogModule, MatInputModule, MatButtonModule, ReactiveFormsModule,
    CommonModule
  ]

})
export class PagoParcialComponent {
  pagoParcialForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<PagoParcialComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { cuenta: any },
    private fb: FormBuilder
  ) {
    this.pagoParcialForm = this.fb.group({
      monto: ['', [Validators.required, Validators.min(1)]]
    });
  }

  confirmarPagoParcial(): void {
    if (this.pagoParcialForm.valid) {
      this.dialogRef.close(this.pagoParcialForm.value.monto);
    }
  }

  cancelar(): void {
    this.dialogRef.close();
  }
}
