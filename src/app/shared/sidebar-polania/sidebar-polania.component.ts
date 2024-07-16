import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MatNavList } from '@angular/material/list';
import { MatDivider, MatDividerModule } from '@angular/material/divider';
import { navbarData } from './nav-data';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'sidebar-polania',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatToolbar,
    MatIcon,
    RouterOutlet,
    MatNavList,
    MatDivider,
    RouterModule,
    MatDividerModule
  ],
  templateUrl: './sidebar-polania.component.html',
  styleUrls: ['./sidebar-polania.component.css']
})
export class SidebarPolaniaComponent {

  collapsad = false;
  navData = navbarData;
    


}
