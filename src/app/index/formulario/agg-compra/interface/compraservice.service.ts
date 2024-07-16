import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { appsetting } from '../../../../settings/appsetting';

@Injectable({
  providedIn: 'root'
})
export class CompraserviceService {

  private apiUrl = appsetting.apiUrl;

  constructor(private http: HttpClient) {}

  saveCompraBs(compra: any, token: string): Observable<void> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<void>(`${this.apiUrl}/compras`, compra, { headers });
  }
}
