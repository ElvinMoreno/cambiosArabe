import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { appsetting } from '../settings/appsetting';
import { Usuario } from '../interfaces/Usuario';
import { Observable } from 'rxjs';
import { ResponseAcceso } from '../interfaces/ResponseAcceso';
import { Login } from '../interfaces/login';

@Injectable({
  providedIn: 'root',
})
export class AccesoService {
  private http = inject(HttpClient);
  private baseUrl: string = appsetting.apiUrl;

  constructor() {}

  registrarse(objeto: Usuario): Observable<ResponseAcceso> {
    return this.http.post<ResponseAcceso>(`${this.baseUrl}auth/register`, objeto);
  }

  login(objeto: Login): Observable<ResponseAcceso> {
    return this.http.post<ResponseAcceso>(`${this.baseUrl}auth/login`, objeto);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
}
