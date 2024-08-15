import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { CuentaBancariaService } from '../../../services/cuenta-bancaria.service';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-revisar',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    FormsModule
  ],
  templateUrl: './revisar.component.html',
  styleUrls: ['./revisar.component.css']
})
export class RevisarComponent implements OnInit {
  displayedColumns: string[] = ['nombreCuenta', 'responsable', 'monto', 'acciones'];
  dataSource: any[] = [];
  filteredDataSource: any[] = [];
  isMobile = false;
  filterText: string = '';

  constructor(private cuentaBancariaService: CuentaBancariaService) {}

  ngOnInit(): void {
    this.loadCuentas();
  }

  loadCuentas(): void {
    this.cuentaBancariaService.getCuentasColombianas().subscribe(
      (data: any[]) => {
        this.dataSource = data;
        this.applyFilter(); // Aplicar filtro inicial
      },
      (error) => {
        console.error('Error al cargar las cuentas:', error);
      }
    );
  }

  applyFilter(): void {
    if (this.filterText) {
      this.filteredDataSource = this.dataSource.filter(element =>
        element.responsable && element.responsable.toLowerCase().includes(this.filterText.toLowerCase())
      );
    } else {
      this.filteredDataSource = this.dataSource;
    }
  }

}
