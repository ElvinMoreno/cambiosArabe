import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CuentaBancaria } from '../../../interfaces/cuenta-bancaria';
import { CuentaBancariaService } from '../../../services/cuenta-bancaria.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-modal-bancos',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatSelectModule, MatInputModule],
  templateUrl: './modal-bancos.component.html',
  styleUrls: ['./modal-bancos.component.css']
})
export class ModalBancosComponent implements OnInit {
  cuentas: CuentaBancaria[] = [];
  selectedCuenta: string | null = null;
  comision: number | null = null;

  constructor(
    public dialogRef: MatDialogRef<ModalBancosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, // Para recibir el ID de la venta
    private cuentaBancariaService: CuentaBancariaService
  ) {}

  ngOnInit(): void {
    this.cuentaBancariaService.getCuentasVenezolanas().subscribe(
      (data: CuentaBancaria[]) => {
        this.cuentas = data;
      },
      (error) => {
        console.error('Error al cargar las cuentas venezolanas', error);
      }
    );
  }

  onConfirm(): void {
    if (this.selectedCuenta && this.comision !== null) {
      this.dialogRef.close({ cuentaId: this.selectedCuenta, comision: this.comision, ventaId: this.data.ventaId });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
