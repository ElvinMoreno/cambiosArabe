import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importa CommonModule para directivas como ngFor, ngIf, etc.
import { MatTabsModule } from '@angular/material/tabs'; // Importa MatTabsModule para los tabs
import { MatIconModule } from '@angular/material/icon'; // Importa MatIconModule si usas mat-icon
import { MatButtonModule } from '@angular/material/button'; // Importa MatButtonModule si usas botones de Angular Material
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-balance',
  standalone: true,
  imports: [
    CommonModule, // Asegúrate de que CommonModule esté importado
    MatTabsModule, // Importa MatTabsModule para el uso de mat-tab-group y mat-tab
    MatIconModule, // Importa MatIconModule para el uso de mat-icon
    MatButtonModule // Importa MatButtonModule si usas botones
  ],
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.css']
})
export class BalanceComponent implements OnInit {
  selectedTabIndex = 0;
  ventasDiarias: number = 6545.7;
  balances = [
    { fecha: '12/02/24', ingreso: 780, salida: 600, neto: 180 },
    // Agrega más datos aquí
  ];

  constructor() {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.createVentasDiasChart();
  }

  createVentasDiasChart(): void {
    const ctx = document.getElementById('ventasDiasChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
        datasets: [{
          label: 'Ventas',
          data: [6545.7, 7000, 7200, 7100, 6900, 6800, 6750],
          borderColor: '#5e94ff',
          fill: false
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}
