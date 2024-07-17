import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { CuentaBancaria } from '../../interfaces/cuenta-bancaria';
import { CuentaBancariaService } from '../../services/cuenta-bancaria.service';

@Component({
  selector: 'app-cuenta-bancaria',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    CommonModule
  ],
  templateUrl: './cuenta-bancaria.component.html',
  styleUrls: ['./cuenta-bancaria.component.css']
})
export class CuentaBancariaComponent implements OnInit {
  mostrarBotones = false;
  cuentasBancarias: CuentaBancaria[] = [];

  constructor(private router: Router, private cuentaBancariaService: CuentaBancariaService) {}

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

  navegar(ruta: string) {
    this.router.navigate([ruta]);
  }
}
