import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

import { CuentaBancaria } from '../../../interfaces/cuenta-bancaria'
import { CuentaBancariaService } from '../../../services/cuenta-bancaria.service';

@Component({
  selector: 'app-cuenta-colombiana',
  standalone: true,
  imports: [MatCardModule,
    MatIconModule,
    MatDividerModule,
    CommonModule],
  templateUrl: './cuenta-colombiana.component.html',
  styleUrl: './cuenta-colombiana.component.css'
})
export class CuentaColombianaComponent  implements OnInit {

  cuentasBancarias: CuentaBancaria[] = [];

  constructor(private cuentaBancariaService: CuentaBancariaService) {}

  ngOnInit(): void {
    this.loadCuentasBancarias();
  }

  loadCuentasBancarias(): void {
    this.cuentaBancariaService.getAllCuentasBancarias().subscribe(
      (data: CuentaBancaria[]) => {
        this.cuentasBancarias = data;
      },
      (error) => {
        console.error('Error al obtener las cuentas bancarias:', error);
      }
    );
  }

}
