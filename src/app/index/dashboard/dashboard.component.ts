import { Component, AfterViewInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports:[MatIcon],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements AfterViewInit {
  constructor() {
    Chart.register(...registerables);
  }

  ngAfterViewInit(): void {
    this.createExchangeRateChart();
    this.createTransactionVolumeChart();
  }

  createExchangeRateChart(): void {
    const ctx = document.getElementById('exchangeRateChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
        datasets: [{
          label: 'Tasa de Cambio (USD/EUR)',
          data: [1.1, 1.2, 1.15, 1.18, 1.25, 1.22, 1.19],
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

  createTransactionVolumeChart(): void {
    const ctx = document.getElementById('transactionVolumeChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        datasets: [{
          label: 'Volumen de Transacciones',
          data: [30, 50, 40, 60, 80, 90, 70, 100, 120, 130, 110, 90],
          backgroundColor: '#5e94ff'
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
