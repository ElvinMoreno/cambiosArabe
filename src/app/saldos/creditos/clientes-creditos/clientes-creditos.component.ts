import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../../../services/clientes.service';
import { Cliente } from '../../../interfaces/clientes';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-clientes-creditos',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './clientes-creditos.component.html',
  styleUrls: ['./clientes-creditos.component.css']
})
export class ClientesCreditosComponent implements OnInit {
  clientes: Cliente[] = [];
  errorMessage: string | null = null;
  selectedCliente: Cliente | null = null;  // Cliente seleccionado para el modal

  constructor(private clienteService: ClienteService) {}

  ngOnInit(): void {
    this.loadClientes();
  }

  loadClientes(): void {
    this.clienteService.getAllClientes()
      .pipe(
        catchError(error => {
          console.error('Error al obtener los clientes:', error);
          this.errorMessage = 'Ocurrió un error al obtener los datos. Por favor, inténtalo de nuevo.';
          return of([]);
        })
      )
      .subscribe(data => {
        this.clientes = data.filter(cliente => cliente.permitirCredito);
      });
  }

  getTotalCredito(cliente: Cliente): number {
    return cliente.creditos.reduce((total, credito) => total + credito.precio, 0);
  }

  openCreditoDetalle(cliente: Cliente): void {
    this.selectedCliente = cliente;  // Asignar el cliente seleccionado para mostrar en el modal
  }

  closeModal(): void {
    this.selectedCliente = null;  // Cerrar el modal
  }
}
