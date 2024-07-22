import { Component, EventEmitter, Output, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule, formatDate } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { ClienteService } from '../../../services/clientes.service';
import { MetodoPagoService } from '../../../services/metodo-pago.service';
import { CuentaBancariaService } from '../../../services/cuenta-bancaria.service';
import { TasaService } from '../../../services/tasa.service';

@Component({
  selector: 'app-bancolombia',
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
    MatIconModule,
  ],
  templateUrl: './bancolombia.component.html',
  styleUrls: ['./bancolombia.component.css'],
})
export class BancolombiaComponent implements OnInit {
  @Output() cancelar = new EventEmitter<void>();
  @Output() confirmar = new EventEmitter<any>();

  form: FormGroup;
  currentLabel = 'Cantidad bolívares';
  currentType = 'number';
  cuentasVenezolanas: any[] = [];
  cuentasColombianas: any[] = [];
  metodosPago: any[] = [];
  clientes: any[] = [];
  currentDate: string;
  tasaCompra: number | null = null;

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private metodoPagoService: MetodoPagoService,
    private cuentaBancariaService: CuentaBancariaService,
    private tasaService: TasaService,
    public dialogRef: MatDialogRef<BancolombiaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      nombreCuenta: ['', Validators.required],
      numeroCuenta: ['', Validators.required],
      fecha: ['', Validators.required],
      cuentaBs: ['', Validators.required],
      tipoPago: ['', Validators.required],
      conversionAutomatica: [{value: '', disabled: true}, Validators.required],
      comision: ['', Validators.required],
      celular: ['', Validators.required],
      cliente: ['', Validators.required],
      cuentaPesos: ['', Validators.required],
      cantidad: ['', Validators.required],
      tasa: ['', Validators.required],
      cedula: ['', Validators.required]
    });

    const today = new Date();
    this.currentDate = formatDate(today, 'dd/MM/yyyy HH:mm', 'en-US');
  }

  ngOnInit(): void {
    this.loadInitialData();
    this.form.patchValue({ fecha: this.currentDate });
    this.setupFormListeners();
  }

  loadInitialData(): void {
    this.clienteService.getAllClientes().subscribe(
      (data: any[]) => {
        this.clientes = data;
      },
      (error) => {
        console.error('Error al cargar los clientes', error);
      }
    );

    this.metodoPagoService.getAllMetodosPago().subscribe(
      (data: any[]) => {
        this.metodosPago = data;
      },
      (error) => {
        console.error('Error al cargar los métodos de pago', error);
      }
    );

    this.cuentaBancariaService.getCuentasVenezolanas().subscribe(
      (data: any[]) => {
        this.cuentasVenezolanas = data;
      },
      (error) => {
        console.error('Error al cargar las cuentas venezolanas', error);
      }
    );

    this.cuentaBancariaService.getCuentasColombianas().subscribe(
      (data: any[]) => {
        this.cuentasColombianas = data;
      },
      (error) => {
        console.error('Error al cargar las cuentas colombianas', error);
      }
    );

    this.tasaService.getTasaDelDia().subscribe(
      (data: any) => {
        this.tasaCompra = data?.tasaCompra || null;
        this.form.patchValue({ tasa: this.tasaCompra });
      },
      (error) => {
        console.error('Error al cargar la tasa del día', error);
      }
    );
  }

  setupFormListeners(): void {
    this.form.get('cantidad')?.valueChanges.subscribe(value => {
      this.updateConversionAutomatica(value);
    });

    this.form.get('tasa')?.valueChanges.subscribe(() => {
      const cantidadValue = this.form.get('cantidad')?.value;
      if (cantidadValue) {
        this.updateConversionAutomatica(cantidadValue);
      }
    });
  }

  updateConversionAutomatica(value: number): void {
    const tasa = this.form.get('tasa')?.value;
    if (tasa && value) {
      let resultado: number;
      if (this.currentLabel === 'Cantidad bolívares') {
        resultado = value * tasa;
      } else {
        resultado = value / tasa;
      }
      this.form.patchValue({ conversionAutomatica: resultado.toFixed(2) }, { emitEvent: false });
    } else {
      this.form.patchValue({ conversionAutomatica: '' }, { emitEvent: false });
    }
  }

  toggleCantidad() {
    this.currentLabel = this.currentLabel === 'Cantidad bolívares' ? 'Cantidad pesos' : 'Cantidad bolívares';
    // Reset the cantidad and conversionAutomatica fields
    this.form.patchValue({
      cantidad: '',
      conversionAutomatica: ''
    });
  }

  onConfirmar() {
    if (this.form.valid) {
      this.confirmar.emit(this.form.value);
      this.dialogRef.close(this.form.value); // Close the dialog with the form value
    }
  }

  onCancelar() {
    this.cancelar.emit();
    this.dialogRef.close(); // Close the dialog without returning any value
  }
}
