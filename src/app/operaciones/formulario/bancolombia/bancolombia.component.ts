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
import { Tasa } from '../../../interfaces/tasa';

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
  tasas: Tasa[] = [];

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
      tasa: [{value: '', disabled: true}],
      cedula: ['', Validators.required]
    });

    const today = new Date();
    this.currentDate = formatDate(today, 'dd/MM/yyyy HH:mm', 'en-US');
  }

  ngOnInit(): void {
    this.loadInitialData();
    this.loadTasas();
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
  }

  loadTasas(): void {
    this.tasaService.getAllTasas().subscribe(
      (data: Tasa[]) => {
        this.tasas = data;
      },
      (error) => {
        console.error('Error al cargar las tasas', error);
      }
    );
  }

  setupFormListeners(): void {
    this.form.get('cantidad')?.valueChanges.subscribe(value => {
      this.updateTasa(value);
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
    const tasaActual = this.form.get('tasa')?.value;
    if (tasaActual !== null && value) {
      let resultado: number;
      if (this.currentLabel === 'Cantidad bolívares') {
        resultado = value * tasaActual;
      } else {
        resultado = value / tasaActual;
      }
      this.form.patchValue({ conversionAutomatica: resultado.toFixed(2) }, { emitEvent: false });
    } else {
      this.form.patchValue({ conversionAutomatica: '' }, { emitEvent: false });
    }
  }

  updateTasa(value: number): void {
    if (value === null || value === undefined) return;

    let tasaAplicable: Tasa | undefined;

    if (this.currentLabel === 'Cantidad bolívares') {
      tasaAplicable = this.tasas.find(tasa => value >= (tasa.bolivares ?? 0));
    } else {
      tasaAplicable = this.tasas.find(tasa => value >= (tasa.pesos ?? 0));
    }

    if (tasaAplicable) {
      this.form.patchValue({ tasa: tasaAplicable.tasaVenta });
    } else {
      this.form.patchValue({ tasa: null });
    }
  }

  toggleCantidad() {
    this.currentLabel = this.currentLabel === 'Cantidad bolívares' ? 'Cantidad pesos' : 'Cantidad bolívares';
    this.form.patchValue({
      cantidad: '',
      conversionAutomatica: '',
      tasa: null
    });
  }

  onConfirmar() {
    if (this.form.valid) {
      this.confirmar.emit(this.form.value);
      this.dialogRef.close(this.form.value);
    }
  }

  onCancelar() {
    this.cancelar.emit();
    this.dialogRef.close();
  }
}
