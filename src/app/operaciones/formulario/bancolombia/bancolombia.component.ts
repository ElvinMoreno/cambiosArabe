import { Component, EventEmitter, Output, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
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
import { VentaBsService } from '../../../services/venta-bs.service';
import { CuentaDestinatario } from '../../../interfaces/cuenta-destinatario';
import { Crearventa } from '../../../interfaces/crearventa';
import { Subscription } from 'rxjs';
import { VentaBs } from '../../../interfaces/venta-bs';

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
export class BancolombiaComponent implements OnInit, OnDestroy {
  @Output() cancelar = new EventEmitter<void>();
  @Output() confirmar = new EventEmitter<any>();

  form: FormGroup;
  currentLabel = 'Cantidad pesos';
  currentType = 'number';
  cuentasVenezolanas: any[] = [];
  cuentasColombianas: any[] = [];
  metodosPago: any[] = [];
  clientes: any[] = [];
  currentDate: string;
  tasas: Tasa[] = [];
  isSubmitting = false;
  isTasaEditable = false;
  isTasaVisible = false;
  isClienteFinalVisible = false;
  tasaLabel = 'Tasa';
  subscriptions: Subscription = new Subscription();
  formattedPrice: string = ''; // Variable para almacenar el valor formateado
  tasaActual: number | null = null;


  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private metodoPagoService: MetodoPagoService,
    private cuentaBancariaService: CuentaBancariaService,
    private tasaService: TasaService,
    private ventaBsService: VentaBsService,
    public dialogRef: MatDialogRef<BancolombiaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      fecha: ['', Validators.required],
      tipoPago: ['', Validators.required],
      conversionAutomatica: [{ value: '', disabled: true }],
      cliente: ['', Validators.required],
      cuentaPesos: ['', Validators.required],
      precioVentaBs: ['', Validators.required],
      tasaVenta: [{ value: '', disabled: true }],
      clienteFinal: [''],
      cuentasDestinatario: this.fb.array([this.createCuentaDestinatario()]) // Inicializa con un control
    });

    const today = new Date();
    this.currentDate = formatDate(today, 'yyyy-MM-ddTHH:mm:ss.SSSZ', 'en-US');
  }


  // Método para crear un nuevo FormGroup dentro de FormArray
  createCuentaDestinatario(): FormGroup {
    return this.fb.group({
      nombreCuenta: ['', Validators.required],
      numeroCuenta: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      cedula: ['', [Validators.required, Validators.pattern('^[0-9]*$')]]
    });
  }

  addCuentaDestinatario(): void {
    this.cuentasDestinatarioArray.push(this.createCuentaDestinatario());
  }

  get cuentasDestinatarioArray(): FormArray {
    return this.form.get('cuentasDestinatario') as FormArray;
  }

  ngOnInit(): void {
    this.loadInitialData();
    this.loadTasas();
    this.form.patchValue({ fecha: this.currentDate });
    this.setupFormListeners();

    // Solo añadir una cuenta destinatario si el FormArray está vacío
    if (this.cuentasDestinatarioArray.length === 0) {
      this.addCuentaDestinatario();
    }

    this.formattedPrice = this.formatCurrency(this.form.get('precioVentaBs')?.value || 0);

    // Escuchar los cambios en el FormArray y sincronizar con el FormGroup principal
    this.form.get('cuentasDestinatario')?.valueChanges.subscribe((values: any[]) => {
      if (values && values.length > 0) {
        const firstAccount = values[0]; // Asumiendo que necesitas sincronizar el primer registro
        if (firstAccount) {
          this.form.patchValue({
            nombreCuenta: firstAccount.nombreCuenta,
            numeroCuenta: firstAccount.numeroCuenta,
            cedula: firstAccount.cedula
          }, { emitEvent: false });
        }
      }
    });
  }

  // Método que maneja el evento input para formatear el valor
  onInputChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    let rawValue = inputElement.value.replace(/\./g, ''); // Eliminar puntos que formatean el valor
    rawValue = rawValue.replace(/[^0-9]/g, ''); // Eliminar caracteres no numéricos

    const numericValue = parseFloat(rawValue || '0'); // Convertir el valor a número

    // Formatear el valor a miles
    this.formattedPrice = this.formatCurrency(numericValue);

    // Actualizar el control del formulario con el valor numérico puro
    this.form.get('precioVentaBs')?.setValue(numericValue);
  }

  // Formatear el valor con puntos de miles
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-ES', {
      minimumFractionDigits: 0, // No usamos decimales en este caso
      maximumFractionDigits: 0,
    }).format(value);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe(); // Cleanup all subscriptions
  }
  removeCuentaDestinatario(index: number): void {
    this.cuentasDestinatarioArray.removeAt(index);
  }

  loadInitialData(): void {
    this.subscriptions.add(
      this.clienteService.getAllClientes().subscribe(
        (data: any[]) => {
          this.clientes = data;
        },
        (error) => {
          console.error('Error al cargar los clientes', error);
        }
      )
    );

    this.subscriptions.add(
      this.metodoPagoService.getAllMetodosPago().subscribe(
        (data: any[]) => {
          this.metodosPago = data;
        },
        (error) => {
          console.error('Error al cargar los métodos de pago', error);
        }
      )
    );

    this.subscriptions.add(
      this.cuentaBancariaService.getCuentasVenezolanas().subscribe(
        (data: any[]) => {
          this.cuentasVenezolanas = data;
        },
        (error) => {
          console.error('Error al cargar las cuentas venezolanas', error);
        }
      )
    );

    this.subscriptions.add(
      this.cuentaBancariaService.getCuentasColombianas().subscribe(
        (data: any[]) => {
          this.cuentasColombianas = data;
        },
        (error) => {
          console.error('Error al cargar las cuentas colombianas', error);
        }
      )
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
    this.subscriptions.add(
      this.form.get('precioVentaBs')?.valueChanges.subscribe(value => {
        this.updateTasa(value);
        this.updateConversionAutomatica(value);
      })
    );

    this.subscriptions.add(
      this.form.get('tasaVenta')?.valueChanges.subscribe(() => {
        const cantidadValue = this.form.get('precioVentaBs')?.value;
        if (cantidadValue) {
          this.updateConversionAutomatica(cantidadValue);
        }
      })
    );

    this.subscriptions.add(
      this.form.get('cliente')?.valueChanges.subscribe(value => {
        this.isClienteFinalVisible = (value === '1'); // Mostrar el campo solo si el cliente con id 1 está seleccionado
        if (this.isClienteFinalVisible) {
          this.form.get('clienteFinal')?.setValidators(Validators.required);
        } else {
          this.form.get('clienteFinal')?.clearValidators();
          this.form.get('clienteFinal')?.setValue('');
        }
        this.form.get('clienteFinal')?.updateValueAndValidity();
      })
    );
  }

  updateConversionAutomatica(value: number): void {
    this.tasaActual = this.form.get('tasaVenta')?.value;  // Guarda la tasa actual
    if (this.tasaActual !== null && value) {
      let resultado: number;
      if (this.currentLabel === 'Cantidad bolívares') {
        resultado = value * this.tasaActual;
      } else {
        resultado = value / this.tasaActual;
      }
      this.form.patchValue({ conversionAutomatica: resultado.toFixed(2) }, { emitEvent: false });
    } else {
      this.form.patchValue({ conversionAutomatica: '' }, { emitEvent: false });
    }
    console.log(this.tasaActual);
  }

  updateTasa(value: number): void {
    if (value === null || value === undefined) return;

    if (this.tasas.length === 0) {
      console.warn('El array de tasas está vacío. No se puede actualizar la tasa.');
      return;
    }

    if (this.currentLabel === 'Cantidad bolívares') {
      this.updateTasaByBolivares(value);
    } else {
      this.updateTasaByPesos(value);
    }
  }


  updateTasaByBolivares(value: number): void {
    const matchingTasa = this.tasas.find(t => value >= t.bolivares!);
    if (matchingTasa) {
      this.form.patchValue({ tasaVenta: matchingTasa.tasaVenta });
    } else {
      this.form.patchValue({ tasaVenta: null });
    }
  }

  updateTasaByPesos(value: number): void {
    const matchingTasa = this.tasas.find(t => value >= t.pesos!);
    if (matchingTasa) {
      this.form.patchValue({ tasaVenta: matchingTasa.tasaVenta });
    } else {
      this.form.patchValue({ tasaVenta: null });
    }
  }


  toggleCantidad(): void {
    this.currentLabel = this.currentLabel === 'Cantidad bolívares' ? 'Cantidad pesos' : 'Cantidad bolívares';
    this.form.patchValue({
      cantidad: '',
      conversionAutomatica: '',
      tasa: null
    });
  }
  makeTasaEditable(): void {
    this.isTasaEditable = true;
    this.isTasaVisible = true; // Mostrar el campo de "tasa"
    this.tasaLabel = 'Tasa especial';
    this.form.get('tasaVenta')?.enable(); // Asegúrate de habilitar el campo
  }

onConfirmar(): void {
  if (this.form.valid && !this.isSubmitting) {
    this.isSubmitting = true;

    // Asegurarse de que tasaVenta no sea nulo antes de construir los datos
    if (!this.form.get('tasaVenta')?.value) {
      console.error('Error: tasaVenta es null o undefined.');
      this.isSubmitting = false;
      return;
    }

    const ventaData = this.buildVentaData();

    this.ventaBsService.saveVentaBs(ventaData).subscribe(
      () => {
        this.confirmar.emit(ventaData);
        this.dialogRef.close();
        this.isSubmitting = false;
      },
      (error) => {
        console.error('Error al guardar la venta', error);
        this.isSubmitting = false;
      }
    );
  }
}


  buildVentaData(): Crearventa {
    const formValues = this.form.value;

    // Calcular el valor de bolivares como precioVentaBs / tasaVenta
    const bolivares = formValues.precioVentaBs / this.tasaActual!;

    // Construir el objeto VentaBs
    const ventaBs: VentaBs = {
      cuentaBancariaBs: formValues.cuentaBs,
      cuentaBancariaPesos: formValues.cuentaPesos,
      descripcionId: 1,
      clienteId: formValues.cliente,
      fechaVenta: formValues.fechaVenta,
      referencia: formValues.referencia,
      precioVentaBs: formValues.precioVentaBs,
      metodoPagoId: formValues.tipoPago,
      comision: formValues.comision,
      tasaVenta: this.tasaActual!,
      nombreClienteFinal: formValues.clienteFinal,
      banco: formValues.banco,
      entrada: !!formValues.entrada,
      salida: !!formValues.salida
    };

    // Construir el array de cuentas destinatario
    const cuentasDestinatario: CuentaDestinatario[] = formValues.cuentasDestinatario.map((cd: any) => ({
      nombreCuentaDestinatario: cd.nombreCuenta,
      cedula: cd.cedula ? +cd.cedula : null,  // Convertir a número si es posible
      numeroCuenta: cd.numeroCuenta,
      bolivares: bolivares  // Asigna el valor calculado
    }));

    const ventaData: Crearventa = {
      ventaBs: ventaBs,
      cuentasDestinatario: cuentasDestinatario
    };

    console.log(ventaData); // Asegúrate de revisar esto para ver los datos capturados

    return ventaData;
  }



  onCancelar(): void {
    this.cancelar.emit();
    this.dialogRef.close();
  }
}
