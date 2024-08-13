import { Component } from '@angular/core';
import { ClientesCreditosComponent } from './clientes-creditos/clientes-creditos.component';
import { MatTabsModule } from '@angular/material/tabs';
import { ClienteService } from '../../services/clientes.service';
import { catchError, of } from 'rxjs';
@Component({
  selector: 'app-creditos',
  standalone: true,
  imports: [ClientesCreditosComponent,MatTabsModule],
  templateUrl: './creditos.component.html',
  styleUrl: './creditos.component.css'
})
export class CreditosComponent {
  selectedTabIndex = 0;
  totalCreditos: number | null = null;

  constructor( private clienteService: ClienteService) {}

  ngOnInit() {
    this.cargarTotalCreditos();
  }
  cargarTotalCreditos() {
    this.clienteService.getAllClientes()
      .pipe(
        catchError(error => {
          console.error('Error al obtener los créditos:', error);
          return of([]);
        })
      )
      .subscribe(clientes => {
        this.totalCreditos = clientes
          .filter(cliente => cliente.permitirCredito)
          .reduce((total, cliente) => total + cliente.creditos.reduce((sum, credito) => sum + credito.precio, 0), 0);
      });
  }
  get totalCreditosLabel(): string {
  return this.totalCreditos !== null ? `$${this.totalCreditos}` : '$';
  }
}
