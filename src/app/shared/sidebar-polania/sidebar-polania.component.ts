import { Component, EventEmitter, HostListener, OnInit, Output} from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MatNavList } from '@angular/material/list';
import { MatDivider, MatDividerModule } from '@angular/material/divider';
import { navbarData } from './nav-data';
import { CommonModule } from '@angular/common';
import {MatIconModule} from '@angular/material/icon';

interface SideNavToggle{
  screenWidth:number;
  collapsed:boolean;

}

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
    MatDividerModule,
    MatIconModule
  ],
  templateUrl: './sidebar-polania.component.html',
  styleUrls: ['./sidebar-polania.component.css']
})

export class SidebarPolaniaComponent implements OnInit{

  @Output() onToggleSideNav:EventEmitter<SideNavToggle> = new EventEmitter();
  collapsad = false;
  screenWidth =0;
  navData = navbarData;

  @HostListener('window:resize',['$event'])
  onResize(event: any){
    this.screenWidth=window.innerWidth;
    if(this.screenWidth <= 767){
      this.collapsad=false;
      this.onToggleSideNav.emit({collapsed: this.collapsad, screenWidth: this.screenWidth});
    }
  }

  ngOnInit(): void {
    this.screenWidth = window.innerHeight;
  }

  toggleCollapse():void{
    this.collapsad=!this.collapsad;
    this.onToggleSideNav.emit({collapsed: this.collapsad, screenWidth: this.screenWidth});
  }
    
  closeSidenav():void{
    this.collapsad = false;
    this.onToggleSideNav.emit({collapsed: this.collapsad, screenWidth: this.screenWidth});
  }

}
