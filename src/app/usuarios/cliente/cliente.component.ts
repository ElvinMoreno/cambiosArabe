import { CommonModule } from '@angular/common';
import { Component, OnInit, HostListener } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

import { FormularioClienteComponent } from './formulario-cliente/formulario-cliente.component';
import { Cliente } from '../../interfaces/clientes';
import { ClienteService } from '../../services/clientes.service';

@Component({
  selector: 'cliente',
  standalone: true,
  imports: [MatButtonModule, MatTableModule, CommonModule, MatIconModule, MatCardModule],
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {
  ELEMENT_DATA: Cliente[] = [];
  displayedColumns: string[] = ['nombre', 'cedula', 'credito', 'ventaBs'];
  dataSource = this.ELEMENT_DATA;
  isMobile: boolean = false;

  constructor(private clienteService: ClienteService, public dialog: MatDialog) {}

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isMobile = window.innerWidth <= 768;
  }

  ngOnInit(): void {
    this.loadClientes();
    this.isMobile = window.innerWidth <= 768;
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

  getCreditoMaximo(cliente: Cliente): string {
    if (cliente.creditos && cliente.creditos.length > 0) {
      const maxCredito = cliente.creditos.reduce((max, credito) => {
        return credito.precio > max ? credito.precio : max;
      }, 0);
      return maxCredito.toFixed(2);
    }
    return 'null';
  }

  getVentaBsPrice(cliente: Cliente): string {
    if (cliente.ventasBs && cliente.ventasBs.length > 0) {
      const totalVentaBs = cliente.ventasBs.reduce((total, venta) => {
        return total + (venta.precio || 0);  // Evitar undefined
      }, 0);
      return totalVentaBs.toFixed(2);
    }
    return 'null';
  }

  openNuevoClienteDialog(): void {
    const dialogRef = this.dialog.open(FormularioClienteComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadClientes();  // Recargar la lista de clientes después de agregar uno nuevo
      }
    });
  }
}
