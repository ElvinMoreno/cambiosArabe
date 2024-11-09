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
  compra: ActualizarCompraDTO | null = null;

  constructor(
    private fb: FormBuilder,
    private compraService: CompraService,
    public dialogRef: MatDialogRef<ActualizarCompraComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { compraId: number }
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

      // Construir el objeto con solo los campos requeridos
      const compraParaConfirmar: Partial<CompraBsDTO> = {
        id: this.compra.id,
        proveedor: this.compra.proveedor?.nombre!,
        referencia: formValue.referencia,
        montoBs: this.compra.montoBs,
        precio: this.compra.precio,
        tasaCompra: this.compra.tasaCompra
      };

      console.log('Compra para confirmar entrada:', compraParaConfirmar);

      // Llama al método para actualizar la compra
      this.compraService.updateCompra(this.data.compraId, { ...this.compra, referencia: formValue.referencia }).subscribe({
        next: (response) => {
          console.log('Compra actualizada con éxito', response);

          // Llama a confirmarVentaEntrada con los datos específicos
          this.compraService.confirmarVentaEntrada(compraParaConfirmar as CompraBsDTO).subscribe({
            next: (confirmResponse) => {
              console.log('Entrada confirmada con éxito', confirmResponse);
              this.dialogRef.close(true);  // Cierra el diálogo después de confirmar la entrada
            },
            error: (confirmError) => {
              console.error('Error al confirmar la entrada', confirmError);
            }
          });
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
