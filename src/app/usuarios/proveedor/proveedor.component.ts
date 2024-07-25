import { CommonModule } from '@angular/common';
import { Component, OnInit, HostListener } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card'; // Asegúrate de importar MatCardModule

import { FormularioProveedorComponent } from './formulario-proveedor/formulario-proveedor.component';
import { Proveedor } from '../../interfaces/proveedor';
import { ProveedorService } from '../../services/proveedor.service';

@Component({
  selector: 'proveedor',
  standalone: true,
  imports: [MatButtonModule, MatTableModule, CommonModule, MatIconModule, MatCardModule],
  templateUrl: './proveedor.component.html',
  styleUrls: ['./proveedor.component.css']
})
export class ProveedorComponent implements OnInit {
  ELEMENT_DATA: Proveedor[] = [];
  displayedColumns: string[] = ['nombre', 'abono', 'deuda'];
  dataSource = this.ELEMENT_DATA;
  isMobile: boolean = false;

  constructor(private proveedorService: ProveedorService, public dialog: MatDialog) {}

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isMobile = window.innerWidth <= 768;
  }

  ngOnInit(): void {
    this.loadProveedores();
    this.isMobile = window.innerWidth <= 768;
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
