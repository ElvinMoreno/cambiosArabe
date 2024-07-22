import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { ProveedorService } from '../../../services/proveedor.service';
import { ConfirmarAccionComponent } from '../../../confirmar-accion/confirmar-accion.component';
import { Proveedor } from '../../../interfaces/proveedor';


@Component({
  selector: 'app-formulario-proveedor',
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
  templateUrl: './formulario-proveedor.component.html',
  styleUrls: ['./formulario-proveedor.component.css']
})
export class FormularioProveedorComponent {
  @Output() cancelar = new EventEmitter<void>();
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private proveedorService: ProveedorService,
    public dialogRef: MatDialogRef<FormularioProveedorComponent>,
    public dialog: MatDialog
  ) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      deuda: [0, Validators.required],
      abono: [0, Validators.required]
    });
  }

  onConfirmar(): void {
    if (this.form.valid) {
      const dialogRef = this.dialog.open(ConfirmarAccionComponent, {
        width: '300px',
        data: {
          accion: 'Agregar Proveedor',
          message: '¿Estás seguro de que deseas agregar este proveedor?'
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.createProveedor();
        }
      });
    }
  }

  createProveedor(): void {
    if (this.form.valid) {
      const newProveedor: Proveedor = {
        ...this.form.value,
        id: 0,  // Asumimos que el ID será generado por el backend
        creditosProveedor: [],
        compra: []
      };

      this.proveedorService.createProveedor(newProveedor).subscribe(
        (response) => {
          this.dialogRef.close(true);
        },
        (error) => {
          console.error('Error al crear el proveedor:', error);
        }
      );
    }
  }

  onCancelar() {
    this.cancelar.emit();
    this.dialogRef.close();
  }
}
