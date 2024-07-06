import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatDrawerMode, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { RouterOutlet } from '@angular/router';
import { MatNavList } from '@angular/material/list';
import { MatDivider } from '@angular/material/divider';


@Component({
  selector: 'sidebar-polania',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatToolbar,
    MatIcon,
    RouterOutlet,
    MatNavList,
    MatDivider
  ],
  templateUrl: './sidebar-polania.component.html',
  styleUrls: ['./sidebar-polania.component.css']
})
export class SidebarPolaniaComponent {

}
