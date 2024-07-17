import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ProveedorService } from '../services/proveedor.service';
import { Proveedor } from '../interfaces/proveedor';
import { FormularioProveedorComponent } from './formulario-proveedor/formulario-proveedor.component';


@Component({
  selector: 'app-proveedor',
  standalone: true,
  imports: [MatButtonModule, MatTableModule, CommonModule],
  templateUrl: './proveedor.component.html',
  styleUrls: ['./proveedor.component.css']
})
export class ProveedorComponent implements OnInit {
  ELEMENT_DATA: Proveedor[] = [];
  displayedColumns: string[] = ['nombre', 'abono', 'deuda'];
  dataSource = this.ELEMENT_DATA;

  constructor(private proveedorService: ProveedorService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadProveedores();
  }

  loadProveedores(): void {
    this.proveedorService.getAllProveedores().subscribe(
      (data: Proveedor[]) => {
        this.ELEMENT_DATA = data;
        this.dataSource = [...this.ELEMENT_DATA];
      },
      (error) => {
        console.error('Error al obtener los proveedores:', error);
      }
    );
  }

  openNuevoProveedorDialog(): void {
    const dialogRef = this.dialog.open(FormularioProveedorComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProveedores();  // Recargar la lista de proveedores después de agregar uno nuevo
      }
    });
  }
}
