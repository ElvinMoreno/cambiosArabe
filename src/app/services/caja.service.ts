// src/app/services/caja.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { appsetting } from '../settings/appsetting';

interface CuentaDTO {
  id: number;
  divisa: string;
  nombreBanco: string;
  nombreCuenta: string;
  monto: number;
  numCuenta: string;
  limiteCB: number;
  limiteMonto: number;
}

@Injectable({
  providedIn: 'root'
})
export class CajaService {
  private apiUrl = `${appsetting.apiUrl}caja`;; // Ajusta la URL según tu configuración

  constructor(private http: HttpClient) {}

  getCajaDatos(): Observable<CuentaDTO> {
    return this.http.get<CuentaDTO>(this.apiUrl);
  }
}
