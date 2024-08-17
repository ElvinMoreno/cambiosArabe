import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MovimientoService } from '../../services/movimiento.service';
import { MovimientoDiaDTO } from '../../interfaces/MovimientoDiaDTO';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router'; // Importa ActivatedRoute para obtener el parámetro de la ruta
import { MatDialog, MatDialogModule } from '@angular/material/dialog'; // Importa MatDialog
import { DetalleMovimientoCompGenComponent } from '../../shared/detalle-movimiento-comp-gen/detalle-movimiento-comp-gen.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-movimientos-venezolanos',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatDialogModule // Asegúrate de incluir MatDialogModule
  ],
  templateUrl: './movimientos-venezolanos.component.html',
  styleUrls: ['./movimientos-venezolanos.component.css']
})
export class MovimientosVenezolanosComponent implements OnInit, AfterViewInit {
  @ViewChild(MatTable) table!: MatTable<any>;
  displayedColumns: string[];
  dataSource = new MatTableDataSource<MovimientoDiaDTO>();

  constructor(
    private movimientoService: MovimientoService,
    private route: ActivatedRoute,
    private router: Router,  // Inyecta Router
    public dialog: MatDialog  // Inyecta MatDialog
  ) {
    this.displayedColumns = ['fecha', 'descripcion', 'monto'];
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const cuentaId = Number(params.get('cuentaId'));
      if (cuentaId) {
        this.loadMovimientos(cuentaId);
      }
    });
  }

  ngAfterViewInit(): void {
    window.addEventListener('resize', () => {
      this.table.renderRows();
    });
  }

  loadMovimientos(cuentaId: number): void {
    this.movimientoService.getMovimientosVenezolanas(cuentaId).subscribe(
      (data: MovimientoDiaDTO[]) => {
        this.dataSource.data = data.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
      },
      error => {
        console.error('Error al obtener los movimientos:', error);
      }
    );
  }

  // Función para abrir el diálogo con los detalles del movimiento
  openDetalleDialog(movimiento: MovimientoDiaDTO): void {
    this.dialog.open(DetalleMovimientoCompGenComponent, {
      width: '400px',
      panelClass: 'custom-dialog-container', // Clase personalizada para aplicar los estilos
      data: movimiento
    });
  }

  // Nueva función para regresar a la vista de cuenta bancaria en el tab de BS
  goBack(): void {
    this.router.navigate(['/operaciones/cuentaBancaria'], { queryParams: { tab: 1 } });
  }
  
  isToday(dateString: string): boolean {
    const date = new Date(dateString);
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }
}