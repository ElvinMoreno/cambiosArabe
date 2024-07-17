import { Component, Input, input } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { SidebarPolaniaComponent } from '../sidebar-polania/sidebar-polania.component';
import { NavbarComponent } from '../../index/principal/navbar/navbar.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { style } from '@angular/animations';
import { BodySideNavComponent } from '../body-side-nav/body-side-nav.component';

interface SideNavToggle{
  screenWidth:number;
  collapsed:boolean;
}

@Component({
  selector: 'content-polania',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    SidebarPolaniaComponent, 
    NavbarComponent, 
    MatToolbarModule,
    BodySideNavComponent
  ],
  templateUrl: './content-polania.component.html',
  styleUrl: './content-polania.component.css'
})
export class ContentPolaniaComponent {
  opened = true;

  isSideNavCollapsed=false;
  screenWidth=0;
  onToggleSideNav(data:SideNavToggle):void{
    this.screenWidth=data.screenWidth;
    this.isSideNavCollapsed=data.collapsed;
  }
  
}
