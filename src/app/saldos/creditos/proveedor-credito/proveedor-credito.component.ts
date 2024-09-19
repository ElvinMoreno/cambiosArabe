import { Component, OnInit, signal } from '@angular/core';
import { ProveedorService } from '../../../services/proveedor.service';
import { Proveedor } from '../../../interfaces/proveedor';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { catchError, of } from 'rxjs';
import { MatIcon } from '@angular/material/icon';
import { Deuda } from '../../../interfaces/deuda';

@Component({
  selector: 'app-proveedor-credito',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIcon],
  templateUrl: './proveedor-credito.component.html',
  styleUrls: ['./proveedor-credito.component.css']
})
export class ProveedorCreditoComponent implements OnInit {
  proveedores = signal<Proveedor[]>([]);
  creditos = signal<Deuda[]>([]); // Sigues usando la interfaz Deuda
  nombreProveedor: string = '';  // Nombre del proveedor seleccionado
  mostrandoCreditos: boolean = false;  // Para alternar entre vistas
  errorMessage = signal<string | null>(null);

  constructor(private proveedorService: ProveedorService) {}

  ngOnInit(): void {
    this.loadProveedores();
  }

  loadProveedores(): void {
    this.proveedorService.getAllProveedores()
      .pipe(
        catchError(error => {
          console.error('Error al obtener los proveedores:', error);
          this.errorMessage.set('Ocurrió un error al obtener los datos.');
          return of([]);
        })
      )
      .subscribe(data => {
        this.proveedores.set(data);  // Usando signal para actualizar el estado
      });
  }

  mostrarCreditosDeProveedor(proveedor: Proveedor): void {
    this.nombreProveedor = proveedor.nombre || '';  // Guarda el nombre del proveedor seleccionado
    this.proveedorService.getCreditosByProveedorId(proveedor.id)
      .pipe(
        catchError(error => {
          console.error('Error al obtener los créditos:', error);
          this.errorMessage.set('Ocurrió un error al obtener los créditos.');
          return of([]);
        })
      )
      .subscribe((creditosBackend) => {
        // Mapear los datos del backend (ProveedorMovimientosDTO[]) al formato Deuda[]
        const creditosAdaptados: Deuda[] = creditosBackend.map(credito => ({
          fecha: credito.fecha,
          monto: credito.monto,
          saldoActual: credito.saldoActual,
          abono: credito.abono  // Mantener abono como booleano
        }));

        // Ordenar los créditos por fecha de más reciente a menos reciente
        const creditosOrdenados = creditosAdaptados.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

        this.creditos.set(creditosOrdenados);  // Actualiza los créditos adaptados
        this.mostrandoCreditos = true;  // Cambia a la vista de créditos
      });
  }

  regresarAListaDeProveedores(): void {
    this.mostrandoCreditos = false;  // Cambia de vuelta a la vista de proveedores
  }
}
