// caja.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { appsetting } from '../../../settings/appsetting';  // Importa appsetting

interface CajaDTO {
  id: number;
  divisa: string;
  nombreBanco: string;
  nombreCuenta: string;
  monto: number;
  numCuenta: string;
  limiteCB: number;
  limiteMonto: number;
}

interface MovimientoDiaDTO {
  hora: string;
  tipoMovimiento: string;
  monto: number;
  descripcion: string;
  entrada: boolean;
}

@Component({
  selector: 'app-caja',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './caja.component.html',
  styleUrls: ['./caja.component.css']
})
export class CajaComponent implements OnInit {
  caja: CajaDTO | undefined;
  movimientos: MovimientoDiaDTO[] = [];
  error: string | undefined;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getCajaDatos().subscribe(
      data => this.caja = data,
      error => this.error = 'Error fetching caja data: ' + error.message
    );
    this.getMovimientosCaja().subscribe(
      data => this.movimientos = data,
      error => this.error = 'Error fetching movimientos data: ' + error.message
    );
  }

  getCajaDatos(): Observable<CajaDTO> {
    return this.http.get<CajaDTO>(`${appsetting.apiUrl}/caja`);
  }

  getMovimientosCaja(): Observable<MovimientoDiaDTO[]> {
    return this.http.get<MovimientoDiaDTO[]>(`${appsetting.apiUrl}/caja/movimientos`);
  }
}
