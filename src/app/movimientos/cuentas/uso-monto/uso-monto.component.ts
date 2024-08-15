import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CuentaBancaria } from '../../../interfaces/cuenta-bancaria';
import { CuentaBancariaService } from '../../../services/cuenta-bancaria.service';

@Component({
  selector: 'app-uso-monto',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatChipsModule,
    MatProgressBarModule
  ],
  templateUrl: './uso-monto.component.html',
  styleUrls: ['./uso-monto.component.css']
})
export class UsoMontoComponent implements OnInit {
  cuentasColombianas: CuentaBancaria[] = [];

  constructor(private cuentaBancariaService: CuentaBancariaService) {}

  ngOnInit(): void {
    this.loadCuentasColombianas();
  }

  loadCuentasColombianas(): void {
    this.cuentaBancariaService.getCuentasColombianas().subscribe(
      (data: CuentaBancaria[]) => {
        // Ordenar las cuentas por monto, de menor a mayor
        this.cuentasColombianas = data.sort((a, b) => a.monto! - b.monto!);
      },
      (error) => {
        console.error('Error al cargar las cuentas colombianas:', error);
      }
    );
  }
}
