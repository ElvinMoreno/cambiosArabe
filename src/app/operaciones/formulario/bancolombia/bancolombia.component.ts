import { Component, EventEmitter, Output, OnInit, Inject, OnDestroy, ChangeDetectorRef } from '@angular/core';
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
  bolivaresVisible = false;
  bolivaresLabel: number | null = null;
  pesosLabel: number | null = null;
  isBolivaresManual = false;  // Nueva bandera para controlar si el valor de bolívares es manual

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



// Lógica para manejar el input de bolívares o pesos
  onBolivaresOrPesosInput(event: Event, index: number): void {
    const inputElement = event.target as HTMLInputElement;
    const numericValue = parseFloat(inputElement.value || '0');
    const control = this.cuentasDestinatarioArray.controls[index];

    if (control.get('currency')?.value === 'bolivares') {
      control.get('bolivares')?.setValue(numericValue);
      this.applyBolivaresLogic();  // Aplicar la nueva lógica para bolívares
    } else if (control.get('currency')?.value === 'pesos') {
      control.get('pesos')?.setValue(numericValue);
      this.updatePesosLabel();  // Lógica para pesos
    }
  }

      // Actualiza el bolivaresLabel restando solo los valores ingresados en bolívares
    updateBolivaresLabel(): void {
      // Usar setTimeout para permitir que Angular termine de actualizar el formulario antes del cálculo
      setTimeout(() => {
        const tasaVenta = this.form.get('tasaVenta')?.value;  // Obtener la tasa más reciente del formulario
        if (tasaVenta) {
          let totalIngresadoEnBolivares = 0;

          this.cuentasDestinatarioArray.controls.forEach((control) => {
            if (control.get('currency')?.value === 'bolivares') {
              const bolivares = control.get('bolivares')?.value;
              totalIngresadoEnBolivares += bolivares ? parseFloat(bolivares) : 0;
            }
          });

          // Evitar cualquier cálculo relacionado con pesosLabel
          const totalCalculadoEnBolivares = this.pesosLabel!;
          console.log("Esta es la tasa calculando: " + tasaVenta);
          this.bolivaresLabel = totalCalculadoEnBolivares - totalIngresadoEnBolivares;
          console.log("en base a venta " + this.bolivaresLabel)
        }
      }, 0);  // Esperar a que se complete la actualización del formulario
    }

    applyBolivaresLogic(): void {
      setTimeout(() => {
        if (this.tasaActual && this.pesosLabel !== null && this.bolivaresLabel !== null) {
          let totalBolivaresIngresados = 0;
          let totalPesosRestados = 0;

          // Obtener el valor inicial de precioVentaBs
          const precioVentaBs = parseFloat(this.form.get('precioVentaBs')?.value || '0');
          const bolivaresIniciales = precioVentaBs / this.tasaActual; // Calcular bolívares iniciales basados en la tasa
          this.pesosLabel = precioVentaBs; // Inicializamos pesosLabel con el precio de venta

          // Iterar sobre todos los controles dentro del FormArray de cuentas destinatario
          this.cuentasDestinatarioArray.controls.forEach((control) => {
            const bolivares = control.get('bolivares')?.value;

            // Sumar bolívares ingresados si son válidos
            if (bolivares && !isNaN(bolivares)) {
              totalBolivaresIngresados += parseFloat(bolivares);
            }
          });

          if (this.currentLabel === 'Cantidad bolívares') {
            // Lógica cuando el currentLabel es "Cantidad bolívares"
            // Restar los bolívares ingresados del valor inicial en bolívares y calcular la cantidad correspondiente en pesos
            this.bolivaresLabel = bolivaresIniciales - totalBolivaresIngresados;

            this.pesosLabel = precioVentaBs - (totalBolivaresIngresados * this.tasaActual);
            console.log("de cantidad bolivares boli:" + this.bolivaresLabel);
            console.log("de cantidad bolivares peso:" + this.pesosLabel);
            // Asegurarse de que no sean negativos
            if (this.bolivaresLabel < 0) this.bolivaresLabel = 0;
            if (this.pesosLabel < 0) this.pesosLabel = 0;
          } else if (this.currentLabel === 'Cantidad pesos') {
            // Lógica actual cuando el currentLabel es "Cantidad pesos"
            totalPesosRestados = totalBolivaresIngresados * this.tasaActual;

            // Restar los pesos convertidos del valor inicial en pesos
            this.pesosLabel -= totalPesosRestados;

            // Asegurar que pesosLabel no sea negativo
            if (this.pesosLabel < 0) {
              this.pesosLabel = 0;
            }

            // Restar los bolívares ingresados del valor inicial en bolívares
            this.bolivaresLabel = bolivaresIniciales - totalBolivaresIngresados;

            // Asegurar que bolivaresLabel no sea negativo
            if (this.bolivaresLabel < 0) {
              this.bolivaresLabel = 0;
            }
          }

          // Mostrar advertencia si los valores están cerca de 0
          const threshold = 1; // Puedes ajustar el umbral según sea necesario
          if (this.pesosLabel <= threshold || this.bolivaresLabel <= threshold) {
            this.showWarning(); // Mostrar el mensaje de advertencia
          }

          // Forzar la actualización de la vista
          this.cdr.detectChanges();

          // Mostrar los valores en la consola para depuración
          console.log(`Bolivares ingresados: ${totalBolivaresIngresados}`);
          console.log(`Pesos convertidos: ${totalPesosRestados}`);
          console.log(`bolivaresLabel actual: ${this.bolivaresLabel}`);
          console.log(`pesosLabel actual: ${this.pesosLabel}`);
        }
      }, 0);
    }


    // Función para mostrar la advertencia al usuario
    showWarning(): void {
      alert('Advertencia: Los valores de pesos o bolívares están cerca de 0.');
    }


// Método para actualizar pesosLabel restando los valores ingresados en los campos de "pesos"
updatePesosLabel(): void {
  if (this.tasaActual) {
    let totalIngresadoEnPesos = 0;

    // Sumamos todos los valores ingresados en los campos de pesos
    this.cuentasDestinatarioArray.controls.forEach((control) => {
      if (control.get('currency')?.value === 'pesos') {
        const pesos = control.get('pesos')?.value;
        totalIngresadoEnPesos += pesos ? parseFloat(pesos) : 0;
      }
    });

    // Restamos el valor ingresado en los campos de pesos del valor inicial en precioVentaBs
    const precioVentaBs = parseFloat(this.form.get('precioVentaBs')?.value || '0');
    this.pesosLabel = precioVentaBs - totalIngresadoEnPesos;
  }
}

// Método para actualizar pesosLabel basado en el precioVentaBs inicial
updatePesosLabelFromVentaBs(): void {
  if (this.form.get('precioVentaBs')?.value) {
    // Tomamos el valor ingresado en precioVentaBs
    const precioVentaBs = parseFloat(this.form.get('precioVentaBs')?.value || '0');
    this.pesosLabel = precioVentaBs; // Asignamos el valor a pesosLabel
  }
}

  // Método para crear un nuevo FormGroup dentro de FormArray
  createCuentaDestinatario(): FormGroup {
    return this.fb.group({
      nombreCuenta: ['', Validators.required],
      numeroCuenta: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      cedula: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      bolivares: [''], // Campo para bolívares
      pesos: [''], // Nuevo campo para pesos
      currency: ['bolivares'] // Inicializa la moneda en bolívares
    });
  }


  // Modificar el método para que al agregar una nueva cuenta destinatario, el campo "Bolívares" sea visible
  addCuentaDestinatario(): void {
    const newCuenta = this.createCuentaDestinatario();
    this.cuentasDestinatarioArray.push(newCuenta);
    this.bolivaresVisible = true; // Hacer visible el campo "Bolívares"
    this.isBolivaresManual = true; // Marcar que el valor de bolívares será ingresado manualmente
    // Escuchar cambios en el input de bolívares para la nueva cuenta y restar del bolivaresLabel
    this.setupBolivaresListener();
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
        this.updateBolivaresLabel();
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
        this.updatePesosLabelFromVentaBs(); // Cada vez que cambia precioVentaBs, actualizamos pesosLabel
        this.updateConversionAutomatica(value); // Calcular conversión en tiempo rea
      })
    );
      // Escuchar cambios en los campos de pesos dentro del array de cuentas destinatario
  this.subscriptions.add(
    this.cuentasDestinatarioArray.valueChanges.subscribe(() => {
      this.updatePesosLabel(); // Actualizar pesosLabel cuando se modifiquen los campos de pesos
    })
  );

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
    banco: formValues.banco,
    entrada: !!formValues.entrada,
    salida: !!formValues.salida
  };

  // Ajustar la lógica para cada cuenta destinatario
  const cuentasDestinatario: CuentaDestinatario[] = formValues.cuentasDestinatario.map((cd: any) => {
    let bolivares;

    // Verificar si el valor de bolívares es manual o debe calcularse
    if (this.isBolivaresManual && cd.bolivares) {
      bolivares = cd.bolivares;  // Usar el valor ingresado manualmente para cada cuenta
    } else {
      // Calcular el valor de bolívares automáticamente usando la tasa de venta
      bolivares = formValues.precioVentaBs / this.tasaActual!;
    }

    return {
      nombreCuentaDestinatario: cd.nombreCuenta,
      cedula: cd.cedula ? +cd.cedula : null,  // Convertir a número si es posible
      numeroCuenta: cd.numeroCuenta,
      bolivares: bolivares  // Usar el valor de bolívares calculado o manual
    };
  });

  const ventaData: Crearventa = {
    ventaBs: ventaBs,
    cuentasDestinatario: cuentasDestinatario
  };

  console.log(ventaData); // Asegúrate de revisar esto para ver los datos capturados

  return ventaData;
}


openModal(): void {
  const dialogRef = this.dialog.open(ModalContentComponent, {
    width: '400px',
    data: {} // Puedes pasar datos si lo necesitas
  });

  // Cuando el modal se cierre, los datos analizados son asignados a los campos del formulario
  dialogRef.afterClosed().subscribe(result => {
    if (result && !result.error) {
      // Remover cualquier signo de puntuación antes de asignar los valores
      const cleanedNombreCuenta = result.nombreCuenta ? result.nombreCuenta.replace(/[^\w\s]/gi, '') : '';
      const cleanedNumeroCuenta = result.numeroCuenta ? result.numeroCuenta.replace(/[^\w\s]/gi, '') : '';
      const cleanedCedula = result.cedula ? result.cedula.replace(/[^\w\s]/gi, '') : '';

      this.cuentasDestinatarioArray.at(0).patchValue({
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


