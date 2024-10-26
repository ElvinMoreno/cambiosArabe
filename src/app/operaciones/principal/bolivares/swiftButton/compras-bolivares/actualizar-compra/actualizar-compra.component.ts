import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CompraBsDTO } from '../../../../../../interfaces/compra-bs-dto';
import { CompraService } from '../../../../../../services/compra.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActualizarCompraDTO } from '../../../../../../interfaces/actualizar-compras-dto';

@Component({
  selector: 'app-actualizar-compra',
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
  templateUrl: './actualizar-compra.component.html',
  styleUrls: ['./actualizar-compra.component.css']
})
export class ActualizarCompraComponent implements OnInit {
  form: FormGroup;
  compra: ActualizarCompraDTO | null = null;  // Para almacenar la compra cargada

  constructor(
    private fb: FormBuilder,
    private compraService: CompraService,
    public dialogRef: MatDialogRef<ActualizarCompraComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { compraId: number }  // Recibe el ID de la compra a actualizar
  ) {
    this.form = this.fb.group({
      referencia: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.cargarCompra();
  }

  cargarCompra(): void {
    this.compraService.getCompraByIdAct(this.data.compraId).subscribe({
      next: (compra: ActualizarCompraDTO) => {
        this.compra = compra;
        this.form.patchValue({ referencia: compra.referencia });
        console.log(compra);
      },
      error: (error) => {
        console.error('Error al cargar la compra', error);
      }
    });
  }

  onActualizar(): void {
    if (this.form.valid && this.compra) {
      const formValue = this.form.value;

      // Actualizar solo la referencia, manteniendo los demás campos intactos
      const compraActualizada: ActualizarCompraDTO = {
        id: this.compra.id,  // ID de la compra
        proveedor: this.compra.proveedor,  // Mantener el proveedor intacto
        metodoPago: this.compra.metodoPago,  // Mantener el método de pago intacto
        tasaCompra: this.compra.tasaCompra,  // Mantener la tasa de compra intacta
        cuentaBancariaBs: this.compra.cuentaBancariaBs,  // Mantener la cuenta bancaria intacta
        cuentaBancariaPesos: this.compra.cuentaBancariaPesos,  // Mantener la cuenta bancaria de pesos si existe
        fechaCompra: this.compra.fechaCompra,  // Mantener la fecha de compra intacta
        referencia: formValue.referencia,  // Actualizar solo la referencia
        montoBs: this.compra.montoBs,  // Mantener el monto en bolívares
        precio: this.compra.precio,  // Mantener el precio
        entrada: this.compra.entrada,  // Mantener el estado de entrada
        salida: this.compra.salida  // Mantener el estado de salida
      };

      console.log(compraActualizada);

      this.compraService.updateCompra(this.data.compraId, compraActualizada).subscribe({
        next: (response) => {
          console.log('Compra actualizada con éxito', response);
          this.dialogRef.close(true);  // Cierra el diálogo al terminar
        },
        error: (error) => {
          console.error('Error al actualizar la compra', error);
        }
      });
    }
  }


  onCancelar(): void {
    this.dialogRef.close(false);
  }
}
