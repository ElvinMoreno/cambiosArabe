import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CompraBsDTO } from '../../../../../../../interfaces/compra-bs-dto';
import { CompraService } from '../../../../../../../services/compra.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-detalles-compra',
  standalone: true,
  imports: [MatDialogModule, CommonModule, MatButtonModule],
  templateUrl: './detalles-compra.component.html',
  styleUrls: ['./detalles-compra.component.css']
})
export class DetallesCompraComponent implements OnInit {
  compra: CompraBsDTO | null = null;

  constructor(
    private compraService: CompraService,
    public dialogRef: MatDialogRef<DetallesCompraComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number }
  ) {}

  ngOnInit(): void {
    this.compraService.getCompraById(this.data.id).subscribe(
      (data: CompraBsDTO) => {
        this.compra = data;
      },
      (error) => {
        console.error(`Error al obtener la compra con ID ${this.data.id}:`, error);
      }
    );
  }

  close(): void {
    this.dialogRef.close();
  }
}
