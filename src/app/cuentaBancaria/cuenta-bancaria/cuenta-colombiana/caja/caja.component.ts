import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { CajaService } from '../../../../services/caja.service';
import { MovimientoDiaDTO } from '../../../../interfaces/MovimientoDiaDTO';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-caja',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule],
  templateUrl: './caja.component.html',
  styleUrls: ['./caja.component.css']
})
export class CajaComponent implements OnInit {
  monto: number | null = null;
  movimientos: MovimientoDiaDTO[] = [];
  errorMessage: string | null = null;
  displayedColumns: string[] = ['fecha', 'tipoMovimiento', 'monto', 'descripcion', 'entrada'];
  isMobile: boolean = false;

  constructor(private cajaService: CajaService) { }

  ngOnInit(): void {
    this.checkScreenSize(); // Inicializa la detección de tamaño de pantalla
    this.cajaService.getCajaDatos()
      .pipe(
        catchError(error => {
          console.error('Error al obtener datos de la caja:', error);
          this.errorMessage = 'Ocurrió un error al obtener los datos de la caja. Por favor, inténtalo de nuevo.';
          return of(null);
        })
      )
      .subscribe(data => {
        if (data) {
          this.monto = data.monto;
        }
      });

    this.cajaService.getMovimientosCaja()
      .pipe(
        catchError(error => {
          console.error('Error al obtener movimientos de la caja:', error);
          this.errorMessage = 'Ocurrió un error al obtener los movimientos de la caja. Por favor, inténtalo de nuevo.';
          return of([]);
        })
      )
      .subscribe(data => {
        this.movimientos = data;
      });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.checkScreenSize();
  }
  

  checkScreenSize() {
    this.isMobile = window.innerWidth <= 768; // Consideramos 768px como el umbral para móviles
  }
}
