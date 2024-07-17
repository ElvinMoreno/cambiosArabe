import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CompraBsDTO } from '../../../../../../../interfaces/compra-bs-dto';
import { CompraService } from '../../../../../../../services/compra.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-detalles-compra',
  standalone: true,
  imports: [MatDialogModule, CommonModule, MatButtonModule],
  templateUrl: './detalles-compra.component.html',
  styleUrls: ['./detalles-compra.component.css']
})
export class DetallesCompraComponent implements OnInit {
  compra: CompraBsDTO | null = null;
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private compraService: CompraService,
    public dialogRef: MatDialogRef<DetallesCompraComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number }
  ) {}

  ngOnInit(): void {
    this.loadCompraDetails();
  }

  loadCompraDetails(): void {
    this.compraService.getCompraById(this.data.id)
      .pipe(
        catchError(error => {
          this.error = 'No se pudo cargar los detalles de la compra. Por favor, inténtalo de nuevo.';
          console.error('Error al cargar los detalles de la compra:', error);
          return of(null);
        }),
        finalize(() => this.loading = false)
      )
      .subscribe(
        (data: CompraBsDTO | null) => {
          this.compra = data;
          console.log('Detalles de la compra cargados:', this.compra);
        }
      );
  }

  close(): void {
    this.dialogRef.close();
  }
}
