import { Component, EventEmitter, Output, OnInit, Inject, OnDestroy, ChangeDetectorRef, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
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
import { ModalContentComponent } from './modal-content/modal-content.component';
import { BancosService } from '../../../services/banco.service';
import {MatExpansionModule} from '@angular/material/expansion';


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
    MatIconModule, MatExpansionModule
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
  bolivaresVisible = false;
  bolivaresLabel: number | null = null;
  pesosLabel: number | null = null;
  isBolivaresManual = false;  // Nueva bandera para controlar si el valor de bolívares es manual
  cuentaLabel: string[] = []; // Label dinámico para cada cuenta
  showSelectBancos: boolean[] = []; // Nueva propiedad para controlar si se muestra el select de bancos para cada cuenta
  mostrarCuentaPesos: boolean = true;
  step = signal(0);


  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private metodoPagoService: MetodoPagoService,
    private cuentaBancariaService: CuentaBancariaService,
    private tasaService: TasaService,
    private ventaBsService: VentaBsService,
    public dialogRef: MatDialogRef<BancolombiaComponent>,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private BancosService: BancosService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      fecha: ['', Validators.required],
      tipoPago: [''],
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

    // Inicializar los labels dinámicos con "Número de Cuenta"
    this.cuentaLabel.push('Número de Cuenta');
        this.showSelectBancos.push(false); // Inicializar la visibilidad del select de bancos para la primera cuenta

  }

  setStep(index: number) {
    this.step.set(index);
  }

  nextStep() {
    this.step.update(i => i + 1);
  }

  prevStep() {
    this.step.update(i => i - 1);
  }

  // Alternar entre "Número de Cuenta" y "Número de Teléfono"
  togglePhoneLabel(index: number): void {
    this.cuentaLabel[index] = this.cuentaLabel[index] === 'Número de Cuenta' ? 'Número de Teléfono' : 'Número de Cuenta';

    // Si el label es "Número de Teléfono", mostramos el select
    this.showSelectBancos[index] = this.cuentaLabel[index] === 'Número de Teléfono';
  }

   // Alternar entre bolívares y pesos al hacer clic en el botón
   toggleCurrency(index: number): void {
    const control = this.cuentasDestinatarioArray.controls[index];
    const currentCurrency = control.get('currency')?.value;
    const currentValue = control.get('bolivares')?.value || 0; // Obtener valor actual o 0 si está vacío

    if (this.tasaActual) {
      if (currentCurrency === 'bolivares') {
        const convertedValue = currentValue / this.tasaActual; // Convertir de bolívares a pesos
        control.get('bolivares')?.setValue(convertedValue);
        control.get('currency')?.setValue('pesos'); // Cambiar a pesos
      } else {
        const convertedValue = currentValue * this.tasaActual; // Convertir de pesos a bolívares
        control.get('bolivares')?.setValue(convertedValue);
        control.get('currency')?.setValue('bolivares'); // Cambiar a bolívares
      }
    }

    // Si no hay tasa actual, solo cambia el label sin conversión
    if (!this.tasaActual) {
      control.get('currency')?.setValue(currentCurrency === 'bolivares' ? 'pesos' : 'bolivares');
    }
  }

  updateLabelsBasedOnInputs(): void {
    // Verificar que tasaActual y precioVentaBs son válidos
    if (!this.tasaActual) {
      this.bolivaresLabel = 0;
      this.pesosLabel = 0;
      return;
    }

    const precioVentaBs = parseFloat(this.form.get('precioVentaBs')?.value || '0');

    let totalBolivaresIngresados = 0;
    let totalPesosIngresados = 0;

    // Calcular el total de bolívares y pesos ingresados
    this.cuentasDestinatarioArray.controls.forEach((control) => {
      const bolivares = parseFloat(control.get('bolivares')?.value || '0');
      const pesos = parseFloat(control.get('pesos')?.value || '0');

      if (control.get('currency')?.value === 'bolivares') {
        totalBolivaresIngresados += !isNaN(bolivares) ? bolivares : 0;
        // Convertir los bolívares a pesos usando la tasa actual
        totalPesosIngresados += !isNaN(bolivares) ? bolivares * this.tasaActual! : 0;
      } else if (control.get('currency')?.value === 'pesos') {
        totalPesosIngresados += !isNaN(pesos) ? pesos : 0;
        totalBolivaresIngresados += !isNaN(bolivares) ? bolivares / this.tasaActual! : 0;
      }
    });

    // Realizar cálculos según la etiqueta actual
    if (this.currentLabel === 'Cantidad bolívares') {
      // Calcular los bolívares restantes
      this.bolivaresLabel = precioVentaBs - totalBolivaresIngresados;

      // Verificar que los bolívares restantes no sean negativos
      if (this.bolivaresLabel < 0) {
        this.bolivaresLabel = 0;
      }

      // Calcular los pesos correspondientes usando la tasa actual
      this.pesosLabel = this.bolivaresLabel * this.tasaActual;

      // Ajuste para asegurarse de que el valor de pesos es correcto
      if (this.bolivaresLabel === 0 && totalBolivaresIngresados > 0) {
        this.pesosLabel = totalBolivaresIngresados * this.tasaActual;
      }
    } else if (this.currentLabel === 'Cantidad pesos') {
      // Calcular los pesos restantes
      this.pesosLabel = precioVentaBs - totalPesosIngresados;

      // Verificar que los pesos restantes no sean negativos
      if (this.pesosLabel < 0) {
        this.pesosLabel = 0;
      }

      // Calcular los bolívares correspondientes usando la tasa actual
      this.bolivaresLabel = precioVentaBs / this.tasaActual - totalBolivaresIngresados;

      // Verificar que los bolívares restantes no sean negativos
      if (this.bolivaresLabel < 0) {
        this.bolivaresLabel = 0;
      }
    }

    // Forzar la detección de cambios para actualizar la UI
    this.cdr.detectChanges();
  }


  onBolivaresOrPesosInput(event: Event, index: number): void {
    const inputElement = event.target as HTMLInputElement;
    let inputValue = inputElement.value;

    inputValue = inputValue.replace(',', '.');

    const numericValue = parseFloat(inputValue);

    if (isNaN(numericValue)) {
      return;
    }

    const control = this.cuentasDestinatarioArray.controls[index];

    if (control.get('currency')?.value === 'bolivares') {
      control.get('bolivares')?.setValue(numericValue, { emitEvent: false });
    } else if (control.get('currency')?.value === 'pesos') {
      control.get('pesos')?.setValue(numericValue, { emitEvent: false });
    }

    this.updateLabelsBasedOnInputs();
  }

    // Función para mostrar la advertencia al usuario
    showWarning(): void {
      alert('Advertencia: Los valores de pesos o bolívares están cerca de 0.');
    }

    // Método para crear un nuevo FormGroup dentro de FormArray
  createCuentaDestinatario(): FormGroup {
    return this.fb.group({
      nombreCuenta: [''],
      numeroCuenta: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      cedula: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      bolivares: [''], // Campo para bolívares
      pesos: [''], // Nuevo campo para pesos
      banco: [''], // Agregamos el campo banco con validación requerida
      currency: ['bolivares'] // Inicializa la moneda en bolívares
    });
  }

    // Alternar entre "Número de Cuenta" y "Número de Teléfono", y mostrar el select de banco
    togglePhoneAndBanco(index: number): void {
      this.cuentaLabel[index] = this.cuentaLabel[index] === 'Número de Cuenta' ? 'Número de Teléfono' : 'Número de Cuenta';
      this.showSelectBancos[index] = !this.showSelectBancos[index]; // Mostrar u ocultar el select de banco
    }

    addCuentaDestinatario(): void {
      const newCuenta = this.createCuentaDestinatario();
      this.cuentasDestinatarioArray.push(newCuenta);
      this.bolivaresVisible = true; // Hacer visible el campo "Bolívares"
      this.isBolivaresManual = true; // Marcar que el valor de bolívares será ingresado manualmente
      // Escuchar cambios en el input de bolívares para la nueva cuenta y restar del bolivaresLabel
      this.setupBolivaresListener();
      this.cuentaLabel.push('Número de Cuenta'); // Agregar un nuevo label
      this.showSelectBancos.push(false); // Inicializar la visibilidad del select
    }


  get cuentasDestinatarioArray(): FormArray {
    return this.form.get('cuentasDestinatario') as FormArray;
  }


  ngOnInit(): void {
    this.loadInitialData();
    this.loadTasas();
    this.form.patchValue({ fecha: this.currentDate });
    this.setupFormListeners();

    this.onTipoPagoChange();

    this.initializeValueChangesSubscription();

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

  initializeValueChangesSubscription(): void {
    this.form.get('precioVentaBs')?.valueChanges.subscribe(() => {
      this.updateLabelsBasedOnInputs();
    });

    this.form.get('tasaVenta')?.valueChanges.subscribe(() => {
      this.updateLabelsBasedOnInputs();
    });

    this.cuentasDestinatarioArray.valueChanges.subscribe(() => {
      this.updateLabelsBasedOnInputs();
    });
  }

 // Método para escuchar cambios en el campo tipoPago
  onTipoPagoChange(): void {
    this.subscriptions.add(
      this.form.get('tipoPago')?.valueChanges.subscribe((tipoPagoId: number) => {
        this.mostrarCuentaPesos = tipoPagoId != 3; // Ocultar el campo si el id es igual a 3
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

// Método para actualizar los labels de bolívares y pesos según el currentLabel
  updateLabels(): void {
    const precioVentaBs = parseFloat(this.form.get('precioVentaBs')?.value || '0');

    // Verificamos que exista tasaActual y el precio sea válido
    if (!this.tasaActual || isNaN(precioVentaBs)) {
      this.bolivaresLabel = null;
      this.pesosLabel = null;
      return;
    }

    // Realizamos los cálculos dependiendo de currentLabel
    if (this.currentLabel === 'Cantidad bolívares') {
      this.bolivaresLabel = precioVentaBs; // Mantener bolívares
      this.pesosLabel = precioVentaBs * this.tasaActual; // Convertir a pesos
    } else {
      this.pesosLabel = precioVentaBs; // Mantener pesos
      this.bolivaresLabel = precioVentaBs / this.tasaActual; // Convertir a bolívares
    }

    // Forzar la detección de cambios para actualizar la UI
    this.cdr.detectChanges();
  }

  // Lógica para manejar el evento input
  onInputChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;

    // Eliminar cualquier punto del valor ingresado para obtener el valor numérico real
    let rawValue = inputElement.value.replace(/\./g, '');

    // Convertir el valor a número (por si el usuario ingresa caracteres no numéricos)
    let numericValue = parseFloat(rawValue || '0');

    // Actualizar el control del formulario con el valor numérico puro
    this.form.get('precioVentaBs')?.setValue(numericValue);

    // Formatear el valor con puntos de miles para mostrarlo en el input
    this.formattedPrice = this.formatCurrency(numericValue);

    // Forzar la actualización del valor en el campo input para que refleje el formato
    inputElement.value = this.formattedPrice;

    // Actualizar los labels en tiempo real
    this.updateLabels();
  }

// Método para escuchar los cambios en cada campo de bolívares
  setupBolivaresListener(): void {
    this.subscriptions.add(
      this.cuentasDestinatarioArray.valueChanges.subscribe(() => {

      })
    );
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
    this.cuentaLabel.splice(index, 1); // Eliminar el label correspondiente
    this.showSelectBancos.splice(index, 1); // Eliminar la visibilidad del select
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
      this.BancosService.getBancosVenezolanos().subscribe(
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
    }
  }

// Método para alternar entre bolívares y pesos
toggleCantidad(): void {
  this.currentLabel = this.currentLabel === 'Cantidad bolívares' ? 'Cantidad pesos' : 'Cantidad bolívares';

  // Limpiar los valores de los campos relevantes
  this.form.patchValue({
    precioVentaBs: '',
    conversionAutomatica: '',
    tasaVenta: null
  });

  // Forzar la actualización de los labels tras cambiar la moneda
  this.updateLabels();
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


// Lógica para definir si bolívares debe ser tomado del input o calculado automáticamente
  buildVentaData(): Crearventa {
    const formValues = this.form.value;

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
      banco: formValues.banco, // Banco de la venta principal (si es necesario)
      entrada: !!formValues.entrada,
      salida: !!formValues.salida
    };

    const cuentasDestinatario: CuentaDestinatario[] = formValues.cuentasDestinatario.map((cd: any) => {
      let bolivares;

      // Verificar si el valor de bolívares es manual o debe calcularse
      if (this.isBolivaresManual) {
        // Si la moneda es 'bolivares', usar el valor directamente ingresado
        if (cd.currency === 'bolivares' && cd.bolivares) {
          bolivares = cd.bolivares;
        }
        // Si la moneda es 'pesos', calcular el equivalente en bolívares usando la tasa actual
        else if (cd.currency === 'pesos' && cd.bolivares) {
          bolivares = cd.bolivares / this.tasaActual!;
        } else {
          // Manejo de caso donde no hay bolívares ingresados manualmente
          bolivares = 0;
        }
      } else {
        // Calcular el valor de bolívares automáticamente usando la tasa de venta
        bolivares = formValues.precioVentaBs / this.tasaActual!;
      }

      console.log("Banco seleccionado:", cd.banco); // Para verificar el banco seleccionado

      return {
        nombreCuentaDestinatario: cd.nombreCuenta,
        cedula: cd.cedula ? +cd.cedula : null,  // Convertir a número si es posible
        numeroCuenta: cd.numeroCuenta,
        bolivares: bolivares,  // Usar el valor de bolívares calculado o manual
        banco: cd.banco ? cd.banco : null // Enviar el objeto completo del banco seleccionado
      };
    });


    const ventaData: Crearventa = {
      ventaBs: ventaBs,
      cuentasDestinatario: cuentasDestinatario
    };

    console.log(ventaData); // Asegúrate de revisar esto para ver los datos capturados

    return ventaData;
  }


openModal(index: number): void {
  const dialogRef = this.dialog.open(ModalContentComponent, {
    width: '400px',
    data: {} // Puedes pasar datos si lo necesitas
  });

  // Cuando el modal se cierre, los datos analizados son asignados al campo correcto del formulario
  dialogRef.afterClosed().subscribe(result => {
    if (result && !result.error) {
      // Remover cualquier signo de puntuación antes de asignar los valores
      const cleanedNombreCuenta = result.nombreCuenta ? result.nombreCuenta.replace(/[^\w\s]/gi, '') : '';
      const cleanedNumeroCuenta = result.numeroCuenta ? result.numeroCuenta.replace(/[^\w\s]/gi, '') : '';
      const cleanedCedula = result.cedula ? result.cedula.replace(/[^\w\s]/gi, '') : '';

      // Usar el índice proporcionado para actualizar el valor correcto del FormArray
      this.cuentasDestinatarioArray.at(index).patchValue({
        nombreCuenta: cleanedNombreCuenta,
        numeroCuenta: cleanedNumeroCuenta,
        cedula: cleanedCedula
      });
    } else {
      console.error('Error en la respuesta o cierre del modal sin datos.');
    }
  });
}




  onCancelar(): void {
    this.cancelar.emit();
    this.dialogRef.close();
  }
}


