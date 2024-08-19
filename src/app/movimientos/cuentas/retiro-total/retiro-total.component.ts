import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CuentaBancaria } from '../../../interfaces/cuenta-bancaria';
import { CuentaBancariaService } from '../../../services/cuenta-bancaria.service';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmarAccionComponent } from '../../../confirmar-accion/confirmar-accion.component';

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
        // Aquí va la lógica de retiro
        console.log(`Retirando todo el dinero de la cuenta: ${cuenta.nombreBanco}`);
        // Llamada al servicio para realizar el retiro
      } else {
        console.log('Retiro cancelado.');
      }
    });
  }
}
