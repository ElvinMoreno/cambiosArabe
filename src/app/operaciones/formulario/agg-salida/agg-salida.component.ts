import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

import { MetodoPagoService } from '../../../services/metodo-pago.service';
import { CuentaBancariaService } from '../../../services/cuenta-bancaria.service';
import { DescripcionService } from '../../../services/descripcion.service';
import { GastosService } from '../../../services/gastos.service';
import { ProveedorService } from '../../../services/proveedor.service';
import { RetiroService } from '../../../services/retiro.service';

import { MetodoPago } from '../../../interfaces/metodo-pago';
import { CuentaBancaria } from '../../../interfaces/cuenta-bancaria';
import { Descripcion } from '../../../interfaces/descripcion';
import { Gastos } from '../../../interfaces/gastos';
import { Proveedor } from '../../../interfaces/proveedor';
import { Retiro } from '../../../interfaces/retiro';

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
  gastos: Gastos[] = [];
  proveedores: Proveedor[] = [];

  itemsSeleccionados: any[] = [];
  tipoSeleccion: 'descripcion' | 'gasto' = 'descripcion';

  isLoading = false;
  errorMessage: string | null = null;
  showCuentaEntrante = false;
  isMetodoPago5 = false;

  constructor(
    private fb: FormBuilder,
    private metodoPagoService: MetodoPagoService,
    private cuentaBancariaService: CuentaBancariaService,
    private descripcionService: DescripcionService,
    private gastosService: GastosService,
    private proveedorService: ProveedorService,
    private retiroService: RetiroService,
    public dialogRef: MatDialogRef<AggSalidaComponent>
  ) {
    this.form = this.fb.group({
      monto: ['', Validators.required],
      metodoPago: ['', Validators.required],
      destino: ['', Validators.required],
      cuentaEntrante: [''],
      descripcionGasto: ['', Validators.required],
      proveedor: ['']  // Agregamos el campo proveedor
    });
  }

  ngOnInit(): void {
    this.loadMetodosPago();
    this.loadCuentasColombianas();
    this.loadDescripciones();
    this.loadGastos();
    this.loadProveedores();  // Carga la lista de proveedores
    this.itemsSeleccionados = this.descripciones;
  }

  loadMetodosPago(): void {
    this.isLoading = true;
    this.metodoPagoService.getAllMetodosPago().subscribe(
      (data: MetodoPago[]) => {
        this.metodosPago = data.filter(metodo => metodo.id === 1 || metodo.id === 4 || metodo.id === 5);
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
        this.descripciones = data;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error al cargar las descripciones', error);
        this.errorMessage = 'Ocurrió un error al cargar las descripciones. Por favor, inténtalo de nuevo.';
        this.isLoading = false;
      }
    );
  }

  loadGastos(): void {
    this.isLoading = true;
    this.gastosService.getAllGastos().subscribe(
      (data: Gastos[]) => {
        this.gastos = data;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error al cargar los gastos', error);
        this.errorMessage = 'Ocurrió un error al cargar los gastos. Por favor, inténtalo de nuevo.';
        this.isLoading = false;
      }
    );
  }

  loadProveedores(): void {
    this.isLoading = true;
    this.proveedorService.getAllProveedores().subscribe(
      (data: Proveedor[]) => {
        this.proveedores = data;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error al cargar los proveedores', error);
        this.errorMessage = 'Ocurrió un error al cargar los proveedores. Por favor, inténtalo de nuevo.';
        this.isLoading = false;
      }
    );
  }

  toggleTipoSeleccion(): void {
    this.tipoSeleccion = this.tipoSeleccion === 'descripcion' ? 'gasto' : 'descripcion';
    this.itemsSeleccionados = this.tipoSeleccion === 'descripcion' ? this.descripciones : this.gastos;
    this.form.get('descripcionGasto')?.setValue(null);  // Reinicia la selección
  }

  onMetodoPagoChange(): void {
    const metodoPagoId = this.form.get('metodoPago')?.value;
    this.showCuentaEntrante = metodoPagoId === '1';  // Mostrar campo "Cuenta entrante" si el método de pago es transferencia
    this.isMetodoPago5 = metodoPagoId === '5';  // Si el método de pago es 5, ocultar el campo "Cuenta salida"

    if (this.showCuentaEntrante) {
      this.form.get('cuentaEntrante')?.setValidators(Validators.required);
    } else {
      this.form.get('cuentaEntrante')?.clearValidators();
    }
    this.form.get('cuentaEntrante')?.updateValueAndValidity();

    if (this.isMetodoPago5) {
      this.form.get('proveedor')?.setValidators(Validators.required);  // Proveedor requerido si metodoPago es 5
      this.form.get('destino')?.clearValidators();
      this.form.get('destino')?.setValue(null);  // Limpiar el valor seleccionado
    } else {
      this.form.get('proveedor')?.clearValidators();
      this.form.get('destino')?.setValidators(Validators.required);
    }
    this.form.get('proveedor')?.updateValueAndValidity();
    this.form.get('destino')?.updateValueAndValidity();
  }

  onConfirmar() {
    if (this.form.valid) {
      const formValue = this.form.value;

      const retiro: Retiro = {
        cuentaBancariaSalidaId: parseInt(formValue.destino, 10),
        cuentaBancariaEntradaId: this.showCuentaEntrante ? parseInt(formValue.cuentaEntrante, 10) : null,
        metodoPagoId: parseInt(formValue.metodoPago, 10),
        descripcionId: this.tipoSeleccion === 'descripcion' ? parseInt(formValue.descripcionGasto, 10) : null,
        gastoId: this.tipoSeleccion === 'gasto' ? parseInt(formValue.descripcionGasto, 10) : null,
        ProveedorId: this.isMetodoPago5 ? parseInt(formValue.proveedor, 10) : null,  // Asigna proveedorId si aplica
        monto: formValue.monto,
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
