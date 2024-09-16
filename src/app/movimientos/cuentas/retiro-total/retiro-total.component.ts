import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CuentaBancaria } from '../../../interfaces/cuenta-bancaria';
import { CuentaBancariaService } from '../../../services/cuenta-bancaria.service';
import { RetiroService } from '../../../services/retiro.service';  // Importar RetiroService
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmarAccionComponent } from '../../../confirmar-accion/confirmar-accion.component';
import Swal from 'sweetalert2';  // Importar SweetAlert para mostrar mensajes

@Component({
  selector: 'app-retiro-total',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './retiro-total.component.html',
  styleUrls: ['./retiro-total.component.css']
})
export class RetiroTotalComponent implements OnInit {
  cuentasColombianas: CuentaBancaria[] = [];

  constructor(
    private cuentaBancariaService: CuentaBancariaService,
    private retiroService: RetiroService,  // Inyectar RetiroService
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadCuentasColombianas();
  }

  loadCuentasColombianas(): void {
    this.cuentaBancariaService.getCuentasColombianas().subscribe(
      (data: CuentaBancaria[]) => {
        this.cuentasColombianas = data.sort((a, b) => a.monto! - b.monto!);
      },
      (error) => {
        console.error('Error al cargar las cuentas colombianas:', error);
      }
    );
  }

  realizarRetiro(cuenta: CuentaBancaria): void {
    const dialogRef = this.dialog.open(ConfirmarAccionComponent, {
      width: '300px',
      data: {
        message: '¿Está seguro de retirar todo el dinero de la cuenta?',
        accion: 'Retiro'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Confirmación de retiro
        this.retiroService.retiroTotal(cuenta.id!).subscribe(
          () => {
            // Mostrar mensaje de éxito
            Swal.fire({
              title: 'Retiro Exitoso',
              text: `Se ha retirado todo el dinero de la cuenta: ${cuenta.nombreBanco}`,
              icon: 'success',
              confirmButtonText: 'Aceptar'
            });

            // Recargar las cuentas después del retiro
            this.loadCuentasColombianas();
          },
          (error) => {
            console.error('Error al realizar el retiro:', error);
            Swal.fire({
              title: 'Error',
              text: 'Ocurrió un error al realizar el retiro. Por favor, inténtalo de nuevo.',
              icon: 'error',
              confirmButtonText: 'Aceptar'
            });
          }
        );
        console.log(cuenta.id);
      } else {
        console.log('Retiro cancelado.');
      }
    });
  }
}
