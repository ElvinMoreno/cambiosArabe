import { Component, OnInit } from '@angular/core';
import { ProveedorService } from '../../../services/proveedor.service';
import { Proveedor } from '../../../interfaces/proveedor';
import { CreditoProveedor } from '../../../interfaces/creditoProveedor'; // Asegúrate de importar esto
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-proveedor-credito',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './proveedor-credito.component.html',
  styleUrls: ['./proveedor-credito.component.css']
})
export class ProveedorCreditoComponent implements OnInit {
  proveedores: Proveedor[] = [];
  errorMessage: string | null = null;
  selectedProveedor: Proveedor | null = null;

  constructor(private proveedorService: ProveedorService) {}

  ngOnInit(): void {
    this.loadProveedores();
  }

  loadProveedores(): void {
    this.proveedorService.getAllProveedores()
      .pipe(
        catchError(error => {
          console.error('Error al obtener los proveedores:', error);
          this.errorMessage = 'Ocurrió un error al obtener los datos. Por favor, inténtalo de nuevo.';
          return of([]);
        })
      )
      .subscribe(data => {
        this.proveedores = data;
      });
  }

  getTotalDeuda(proveedor: Proveedor): number {
    return proveedor.creditosProveedor.reduce((total, credito) => total + (credito.montoRestante || 0), 0);
  }

  openCreditoDetalle(proveedor: Proveedor): void {
    this.selectedProveedor = proveedor;
  }

  closeModal(): void {
    this.selectedProveedor = null;
  }
}
