import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-cuenta-bancaria',
  standalone: true,
  imports: [
    MatButtonModule,

  ],
  templateUrl: './cuenta-bancaria.component.html',
  styleUrls: ['./cuenta-bancaria.component.css']
})
export class CuentaBancariaComponent{
  constructor(private router: Router) {}
  navegar(ruta: string) {
    this.router.navigate([ruta]);
  }
}
