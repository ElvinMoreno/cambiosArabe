import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { SeguimientoDiaDTO } from '../../interfaces/seguimiento-dia-dto';
import { BalanceService } from '../../services/balance.service';

@Component({
  selector: 'app-seguimiento-caja',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    FormsModule
  ],
  templateUrl: './seguimiento-caja.component.html',
  styleUrls: ['./seguimiento-caja.component.css']
})
export class SeguimientoCajaComponent implements OnInit {
  mesSeleccionado: string = '';  // Almacena el mes seleccionado por el usuario en formato 'yyyy-MM'
  seguimientoCaja: SeguimientoDiaDTO[] = [];  // Almacena los datos del seguimiento

  constructor(private balanceService: BalanceService) {}

  ngOnInit(): void {
    // Inicialmente no cargamos ningún dato hasta que el usuario seleccione un mes
  }

  onMesSeleccionado(event: any): void {
    // Extraer el mes y el año del input en formato 'yyyy-MM'
    const [anio, mes] = event.target.value.split('-');
    if (mes && anio) {
      this.obtenerSeguimientoCajaPorMes(parseInt(mes, 10), parseInt(anio, 10));
    }
  }

  obtenerSeguimientoCajaPorMes(mes: number, anio: number): void {
    this.balanceService.calcularCajaPorMes(mes, anio).subscribe(
      (data: SeguimientoDiaDTO[]) => {
        this.seguimientoCaja = data;
      },
      (error) => {
        console.error('Error al obtener el seguimiento de caja:', error);
      }
    );
  }
}
