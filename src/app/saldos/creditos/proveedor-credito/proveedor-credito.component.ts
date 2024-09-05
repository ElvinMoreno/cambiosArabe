import { Component, OnInit } from '@angular/core';
import { ProveedorService } from '../../../services/proveedor.service';
import { Proveedor } from '../../../interfaces/proveedor';
import { CreditoProveedor } from '../../../interfaces/creditoProveedor'; // Asegúrate de importar esto
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-proveedor-credito',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatDialogModule, FormsModule],
  templateUrl: './proveedor-credito.component.html',
  styleUrls: ['./proveedor-credito.component.css']
})
export class ProveedorCreditoComponent implements OnInit {
  proveedores: Proveedor[] = [];
  errorMessage: string | null = null;
  selectedProveedor: Proveedor | null = null;
  creditosFiltrados: CreditoProveedor[] = [];
  filterDate: string | null = null;

  constructor(private proveedorService: ProveedorService, public dialog: MatDialog) {}

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
    this.creditosFiltrados = [...proveedor.creditosProveedor]; // Mostrar todos los créditos inicialmente
  }

  closeModal(): void {
    this.selectedProveedor = null;
  }

  filtrarPorDia(): void {
    if (this.filterDate && this.selectedProveedor) {
      const selectedDate = new Date(this.filterDate);
      this.creditosFiltrados = this.selectedProveedor.creditosProveedor.filter(credito => {
        const creditoDate = new Date(credito.fechaRegistro);
        return (
          creditoDate.getDate() === selectedDate.getDate() &&
          creditoDate.getMonth() === selectedDate.getMonth() &&
          creditoDate.getFullYear() === selectedDate.getFullYear()
        );
      });
    } else if (this.selectedProveedor) {
      this.creditosFiltrados = [...this.selectedProveedor.creditosProveedor]; // Si no hay fecha seleccionada, muestra todos los créditos
    }
  }

  
}
