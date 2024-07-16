import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule, formatDate } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogRef } from '@angular/material/dialog';
import { CompraserviceService } from './interface/compraservice.service';
import { ResponseAcceso } from '../../../interfaces/ResponseAcceso';

@Component({
  selector: 'app-agg-compra',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatIconModule
  ],
  templateUrl: './agg-compra.component.html',
  styleUrls: ['./agg-compra.component.css']
})
export class AggCompraComponent implements OnInit {

  @Output() cancelar = new EventEmitter<void>();
  form: FormGroup;
  token: string = '';

  constructor(private fb: FormBuilder, private compraService: CompraserviceService, private dialogRef: MatDialogRef<AggCompraComponent>) {
    this.form = this.fb.group({
      proveedorId: ['', Validators.required],
      fechaCompra: ['', Validators.required],
      cuentaBancariaBs: ['', Validators.required],
      cuentaBancariaPesos: ['', Validators.required],
      metodoPagoId: ['', Validators.required],
      tasaCompra: ['', Validators.required],
      montoBs: ['', Validators.required],
      referencia: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Asignar el token desde algún lugar (ej. almacenamiento local, servicio, etc.)
    const responseAcceso: ResponseAcceso = { statusCode: 200, token: 'your-token-here' };
    this.token = responseAcceso.token;
  }

  onConfirmar(): void {
    if (this.form.valid) {
      const formValue = this.form.value;

      // Convertir los valores del formulario al formato requerido por el backend
      const compra = {
        cuentaBancariaBs: formValue.cuentaBancariaBs,
        cuentaBancariaPesos: formValue.cuentaBancariaPesos,
        proveedorId: formValue.proveedorId,
        metodoPagoId: formValue.metodoPagoId,
        tasaCompra: formValue.tasaCompra,
        montoBs: formValue.montoBs,
        fechaCompra: formatDate(formValue.fechaCompra, 'yyyy-MM-ddTHH:mm:ss', 'en-US'),
        referencia: formValue.referencia
      };

      this.compraService.saveCompraBs(compra, this.token).subscribe(() => {
        // Manejo de la respuesta exitosa
        console.log('Compra registrada con éxito');
        this.dialogRef.close();
      }, error => {
        // Manejo de errores
        console.error('Error al registrar la compra', error);
      });
    }
  }

  onCancelar() {
    this.cancelar.emit();
    this.dialogRef.close();
  }
}

