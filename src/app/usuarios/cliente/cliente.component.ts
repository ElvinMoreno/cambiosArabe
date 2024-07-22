// cliente.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Cliente } from '../../interfaces/clientes';
import { ClienteService } from '../../services/clientes.service';

@Component({
  selector: 'cliente',
  standalone: true,
  imports: [MatButtonModule, MatTableModule, CommonModule],
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {
  ELEMENT_DATA: Cliente[] = [];
  displayedColumns: string[] = ['nombre', 'apellido', 'credito', 'ventaBs'];
  dataSource = this.ELEMENT_DATA;

  constructor(private clienteService: ClienteService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadClientes();
  }

  loadClientes(): void {
    this.clienteService.getAllClientes().subscribe(
      (data: Cliente[]) => {
        this.ELEMENT_DATA = data;
        this.dataSource = [...this.ELEMENT_DATA];
      },
      (error) => {
        console.error('Error al obtener los clientes:', error);
      }
    );
  }

  getCreditoPrice(cliente: Cliente): string {
    return cliente.credito && cliente.credito.precio ? cliente.credito.precio.toFixed(2) : 'null';
  }

  getVentaBsPrice(cliente: Cliente): string {
    return cliente.ventasBs && cliente.ventasBs.precio ? cliente.ventasBs.precio.toFixed(2) : 'null';
  }
}
