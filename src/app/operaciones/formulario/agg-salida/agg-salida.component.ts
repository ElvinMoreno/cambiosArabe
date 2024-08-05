import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MetodoPagoService } from '../../../services/metodo-pago.service';
import { CuentaBancariaService } from '../../../services/cuenta-bancaria.service';
import { DescripcionService } from '../../../services/descripcion.service';
import { MetodoPago } from '../../../interfaces/metodo-pago';
import { CuentaBancaria } from '../../../interfaces/cuenta-bancaria';
import { Descripcion } from '../../../interfaces/descripcion';
import { CommonModule } from '@angular/common';
import { Retiro } from '../../../interfaces/retiro';
import { RetiroService } from '../../../services/retiro.service';

@Component({
  selector: 'app-agg-salida',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule
  ],
  templateUrl: './agg-salida.component.html',
  styleUrls: ['./agg-salida.component.css']
})
export class AggSalidaComponent implements OnInit {
  @Output() cancelar = new EventEmitter<void>();
  @Output() confirmar = new EventEmitter<any>();
  form: FormGroup;
  metodosPago: MetodoPago[] = [];
  cuentasColombianas: CuentaBancaria[] = [];
  descripciones: Descripcion[] = [];
  isLoading = false;
  errorMessage: string | null = null;
  showCuentaEntrante = false;

  constructor(
    private fb: FormBuilder,
    private metodoPagoService: MetodoPagoService,
    private cuentaBancariaService: CuentaBancariaService,
    private descripcionService: DescripcionService,
    private retiroService: RetiroService,
    public dialogRef: MatDialogRef<AggSalidaComponent>
  ) {
    this.form = this.fb.group({
      monto: ['', Validators.required],
      metodoPago: ['', Validators.required],
      destino: ['', Validators.required],
      cuentaEntrante: [''],
      descripcion: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadMetodosPago();
    this.loadCuentasColombianas();
    this.loadDescripciones();
  }

  loadMetodosPago(): void {
    this.isLoading = true;
    this.metodoPagoService.getAllMetodosPago().subscribe(
      (data: MetodoPago[]) => {
        this.metodosPago = data.filter(metodo => metodo.id === 1 || metodo.id === 4);
        this.isLoading = false;
      },
      (error) => {
        console.error('Error al cargar los métodos de pago', error);
        this.errorMessage = 'Ocurrió un error al cargar los métodos de pago. Por favor, inténtalo de nuevo.';
        this.isLoading = false;
      }
    );
  }

  loadCuentasColombianas(): void {
    this.isLoading = true;
    this.cuentaBancariaService.getCuentasColombianas().subscribe(
      (data: CuentaBancaria[]) => {
        this.cuentasColombianas = data;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error al cargar las cuentas colombianas', error);
        this.errorMessage = 'Ocurrió un error al cargar las cuentas colombianas. Por favor, inténtalo de nuevo.';
        this.isLoading = false;
      }
    );
  }

  loadDescripciones(): void {
    this.isLoading = true;
    this.descripcionService.getAllDescripciones().subscribe(
      (data: Descripcion[]) => {
        this.descripciones = data.filter(descripcion => descripcion.id === 1 || descripcion.id === 2);
        this.isLoading = false;
      },
      (error) => {
        console.error('Error al cargar las descripciones', error);
        this.errorMessage = 'Ocurrió un error al cargar las descripciones. Por favor, inténtalo de nuevo.';
        this.isLoading = false;
      }
    );
  }

  onMetodoPagoChange(): void {
    const metodoPagoId = this.form.get('metodoPago')?.value;
    this.showCuentaEntrante = metodoPagoId === '1'; // Asumiendo que 1 es el ID para transferencia
    if (this.showCuentaEntrante) {
      this.form.get('cuentaEntrante')?.setValidators(Validators.required);
    } else {
      this.form.get('cuentaEntrante')?.clearValidators();
    }
    this.form.get('cuentaEntrante')?.updateValueAndValidity();
  }

  onConfirmar() {
    if (this.form.valid) {
      const formValue = this.form.value;

      // Crear la fecha en el formato correcto y asegurarse de que esté en UTC
      const now = new Date();
      const fecha = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())).toISOString();

      const retiro: Retiro = {
        cuentaBancariaSalidaId: parseInt(formValue.destino, 10),
        cuentaBancariaEntradaId: this.showCuentaEntrante ? parseInt(formValue.cuentaEntrante, 10) : null,
        metodoPagoId: parseInt(formValue.metodoPago, 10),
        descripcionId: parseInt(formValue.descripcion, 10),
        monto: formValue.monto,
        fecha // La fecha está en formato ISO UTC
      };

      console.log(retiro);

      this.retiroService.saveRetiro(retiro).subscribe(
        response => {
          this.confirmar.emit(retiro);
          this.dialogRef.close();
        },
        error => {
          console.error('Error al realizar el retiro', error);
          this.errorMessage = 'Ocurrió un error al realizar el retiro. Por favor, inténtalo de nuevo.';
        }
      );
    }
  }


  onCancelar() {
    this.cancelar.emit();
    this.dialogRef.close();
  }
}
