import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { ConfirmarAccionComponent } from '../../../confirmar-accion/confirmar-accion.component';
import { Cliente } from '../../../interfaces/clientes';
import { ClienteService } from '../../../services/clientes.service';

@Component({
  selector: 'app-formulario-cliente',
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
  templateUrl: './formulario-cliente.component.html',
  styleUrls: ['./formulario-cliente.component.css']
})
export class FormularioClienteComponent implements OnInit {
  @Output() cancelar = new EventEmitter<void>();
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    public dialogRef: MatDialogRef<FormularioClienteComponent>,
    public dialog: MatDialog
  ) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      cedula: ['', Validators.required],
      permitirCredito: [true, Validators.required],
      limiteCredito: [{ value: 0, disabled: false }]
    });
  }

  ngOnInit(): void {
    this.form.get('permitirCredito')?.valueChanges.subscribe(value => {
      if (value) {
        this.form.get('limiteCredito')?.enable();
      } else {
        this.form.get('limiteCredito')?.disable();
      }
    });
  }

  onConfirmar(): void {
    if (this.form.valid) {
      const dialogRef = this.dialog.open(ConfirmarAccionComponent, {
        width: '300px',
        data: {
          accion: 'Agregar Cliente',
          message: '¿Estás seguro de que deseas agregar este cliente?'
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.createCliente();
        }
      });
    }
  }

  createCliente(): void {
    if (this.form.valid) {
      const newCliente: Cliente = {
        ...this.form.value,
        id: 0  // Asumimos que el ID será generado por el backend
      };

      this.clienteService.createCliente(newCliente).subscribe(
        (response: Cliente) => {
          this.dialogRef.close(true);
        },
        (error: any) => {
          console.error('Error al crear el cliente:', error);
        }
      );
    }
  }

  onCancelar() {
    this.cancelar.emit();
    this.dialogRef.close();
  }
}
