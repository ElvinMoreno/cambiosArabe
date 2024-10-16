import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Chart, registerables } from 'chart.js';
import { BalanceDTO } from '../../interfaces/balance-dto';
import { BalanceService } from '../../services/balance.service';


@Component({
  selector: 'app-balance',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.css']
})
export class BalanceComponent implements OnInit {
  selectedTabIndex = 0;
  ventasDiarias: number = 6545.7;
  balances: BalanceDTO[] = [];  // Inicializamos un arreglo vacío de BalanceDTO

  constructor(
    private balanceService: BalanceService  // Inyectamos el servicio
  ) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.createVentasDiasChart();
    this.loadBalances();  // Llamamos al método para cargar los balances
  }

  // Método para cargar los balances usando el servicio
  loadBalances(): void {
    this.balanceService.obtenerBalance().subscribe(
      (data: BalanceDTO[]) => {
        this.balances = data;
      },
      (error) => {
        console.error('Error al cargar los balances:', error);
      }
    );
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
