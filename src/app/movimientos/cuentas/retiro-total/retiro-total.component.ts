import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CuentaBancaria } from '../../../interfaces/cuenta-bancaria';
import { CuentaBancariaService } from '../../../services/cuenta-bancaria.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-retiro-total',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './retiro-total.component.html',
  styleUrls: ['./retiro-total.component.css']
})
export class RetiroTotalComponent implements OnInit {
  cuentasColombianas: CuentaBancaria[] = [];

  constructor(private cuentaBancariaService: CuentaBancariaService) {}

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
    // Lógica para realizar el retiro
    console.log(`Realizando retiro de la cuenta: ${cuenta.nombreBanco}`);
    // Aquí puedes agregar la lógica para el retiro, como abrir un diálogo o realizar una solicitud a un servicio
  }
}
