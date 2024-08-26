import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BalanceComponent } from './balance/balance.component';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [
    CommonModule,
    MatIcon,
    MatTabsModule,
    DashboardComponent,
    BalanceComponent
  ],
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent {
  selectedTabIndex = 0;

  // Métodos opcionales para manejar el cambio de pestañas
  onTabChange(index: number) {
    this.selectedTabIndex = index;
  }
}
