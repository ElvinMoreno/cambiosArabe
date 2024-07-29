import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule, formatDate } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogRef } from '@angular/material/dialog';
import { MetodoPagoService } from '../../../services/metodo-pago.service';
import { CuentaBancariaService } from '../../../services/cuenta-bancaria.service';
import { ProveedorService } from '../../../services/proveedor.service';
import { TasaService } from '../../../services/tasa.service';
import { CompraService } from '../../../services/compra.service';
import { CompraBsDTO } from '../../../interfaces/compra-bs-dto';
import { DescripcionService } from '../../../services/descripcion.service';

@Component({
  selector: 'app-agg-compra',
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
  templateUrl: './agg-compra.component.html',
  styleUrls: ['./agg-compra.component.css']
})
export class AggCompraComponent implements OnInit {
  @Output() cancelar = new EventEmitter<void>();
  @Output() compraCreada = new EventEmitter<void>(); // Nuevo EventEmitter
  form: FormGroup;
  token: string = '';
  metodosPago: any[] = [];
  cuentasVenezolanas: any[] = [];
  cuentasColombianas: any[] = [];
  proveedores: any[] = [];
  descripciones: any[] = []; // Añadir descripciones
  tasaCompra: number = 0;
  errorMessage: string = '';
  currentDate: string = '';

  constructor(
    private fb: FormBuilder,
    private compraService: CompraService,
    private metodoPagoService: MetodoPagoService,
    private cuentaBancariaService: CuentaBancariaService,
    private proveedorService: ProveedorService,
    private tasaService: TasaService,
    private descripcionService: DescripcionService, // Inyectar DescripcionService
    private dialogRef: MatDialogRef<AggCompraComponent>
  ) {
    this.form = this.fb.group({
      proveedorId: ['', [Validators.required]],
      fechaCompra: ['', [Validators.required]],
      cuentaBancariaBs: ['', [Validators.required]],
      cuentaBancariaPesos: ['', [Validators.required]],
      metodoPagoId: ['', [Validators.required]],
      descripcionId: ['', [Validators.required]], // Añadir este campo
      tasaCompra: ['', [Validators.required]],
      montoBs: ['', [Validators.required, Validators.min(0)]],
      referencia: ['', [Validators.required]]
    });
    this.currentDate = new Date().toISOString().substring(0, 16);
  }

  ngOnInit(): void {
    this.cargarDatos();
    this.form.patchValue({ fechaCompra: this.currentDate });
  }

  cargarDatos(): void {
    const responseAcceso = { statusCode: 200, token: 'your-token-here' };
    this.token = responseAcceso.token;

    this.metodoPagoService.getAllMetodosPago().subscribe({
      next: (data: any[]) => this.metodosPago = data,
      error: (error) => console.error('Error al cargar los métodos de pago', error)
    });

    this.cuentaBancariaService.getCuentasVenezolanas().subscribe({
      next: (data: any[]) => this.cuentasVenezolanas = data,
      error: (error) => console.error('Error al cargar las cuentas venezolanas', error)
    });

    this.cuentaBancariaService.getCuentasColombianas().subscribe({
      next: (data: any[]) => this.cuentasColombianas = data,
      error: (error) => console.error('Error al cargar las cuentas colombianas', error)
    });

    this.proveedorService.getAllProveedores().subscribe({
      next: (data: any[]) => this.proveedores = data,
      error: (error) => console.error('Error al cargar los proveedores', error)
    });

    this.descripcionService.getAllDescripciones().subscribe({ // Cargar descripciones
      next: (data: any[]) => this.descripciones = data,
      error: (error) => console.error('Error al cargar las descripciones', error)
    });

    this.cargarTasaCompra();
  }

  cargarTasaCompra(): void {
    this.tasaService.getAllTasas().subscribe({
      next: (data: any[]) => {
        const today = new Date().toISOString().split('T')[0];
        const tasaHoy = data.find(tasa => {
          if (tasa.fechaTasa) {
            const tasaFecha = new Date(tasa.fechaTasa).toISOString().split('T')[0];
            return tasaFecha === today;
          }
          return false;
        });
        if (tasaHoy) {
          this.tasaCompra = tasaHoy.tasaCompra ?? 0;
          this.form.patchValue({ tasaCompra: this.tasaCompra });
        } else {
          console.error('No se encontró tasa para la fecha actual');
          this.tasaCompra = 0;
        }
      },
      error: (error) => {
        console.error('Error al cargar las tasas', error);
        this.tasaCompra = 0;
      }
    });
  }

  onConfirmar(): void {
    if (this.form.valid) {
      const formValue = this.form.getRawValue(); // Obtiene todos los valores, incluyendo los deshabilitados

      console.log('Formulario válido. Valores del formulario:', formValue);

      const compra: CompraBsDTO = {
        cuentaBancariaBsId: parseInt(formValue.cuentaBancariaBs, 10),
        cuentaBancariaPesosId: parseInt(formValue.cuentaBancariaPesos, 10),
        proveedorId: parseInt(formValue.proveedorId, 10),
        metodoPagoId: parseInt(formValue.metodoPagoId, 10),
        descripcionId: parseInt(formValue.descripcionId, 10), // Añadir este campo
        tasaCompra: parseFloat(formValue.tasaCompra),
        montoBs: parseFloat(formValue.montoBs),
        fechaCompra: formValue.fechaCompra ? new Date(formValue.fechaCompra).toISOString() : new Date().toISOString(),
        referencia: formValue.referencia
      };

      console.log('Datos a enviar:', compra);

      this.compraService.newCompraBs(compra).subscribe({
        next: (response) => {
          console.log('Compra registrada con éxito', response);
          this.dialogRef.close();
          this.compraCreada.emit(); // Emitir evento cuando se crea una compra
        },
        error: (error) => {
          console.error('Error al registrar la compra', error);
          this.errorMessage = 'Ocurrió un error al registrar la compra. Inténtelo nuevamente.';
        }
      });
    } else {
      console.error('Formulario inválido:', this.form.errors);
      this.errorMessage = 'Por favor, complete todos los campos requeridos.';
    }
  }

  onCancelar(): void {
    this.cancelar.emit();
    this.dialogRef.close();
  }
}
