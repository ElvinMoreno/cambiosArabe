import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { appsetting } from '../settings/appsetting';
import { ResponseCliente } from '../interfaces/ResponseClientes';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  private http=inject(HttpClient);
  private baseUrl:string=appsetting.apiUrl;

  constructor() { }

  list():Observable <ResponseCliente>{
    return this.http.get<ResponseCliente>(`${this.baseUrl}cliente`)
  }
}
