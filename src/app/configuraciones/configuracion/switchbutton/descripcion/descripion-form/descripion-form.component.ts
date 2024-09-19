import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'descripcion-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './descripion-form.component.html',
  styleUrls: ['./descripion-form.component.css']
})
export class DescripcionFormComponent {
  form: FormGroup;
  titulo: string;
  campoPlaceholder: string;
  campoLabel: string;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DescripcionFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any  // Recibe los datos a través de MAT_DIALOG_DATA
  ) {
    this.titulo = data.titulo || 'Formulario';
    this.campoPlaceholder = data.campoPlaceholder || 'Ingrese el texto';
    this.campoLabel = data.campoLabel || 'Campo';
    this.form = this.fb.group({
      texto: [data.formData.texto || '', Validators.required]
    });
  }

  onConfirmar(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  onCancelar(): void {
    this.dialogRef.close();
  }
}
