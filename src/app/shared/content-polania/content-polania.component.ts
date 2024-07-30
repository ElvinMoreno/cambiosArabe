import { Component, HostListener, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { SidebarPolaniaComponent } from '../sidebar-polania/sidebar-polania.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BodySideNavComponent } from '../body-side-nav/body-side-nav.component';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
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
    MatToolbarModule,
    BodySideNavComponent
  ],
  templateUrl: './content-polania.component.html',
  styleUrls: ['./content-polania.component.css']
})
export class ContentPolaniaComponent implements OnInit, AfterViewInit {
  @ViewChild('sideNav', { static: false }) sideNav!: ElementRef;

  opened = true;
  isSideNavCollapsed = false;
  screenWidth = 0;

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 768) {
      this.isSideNavCollapsed = true;
      this.opened = false;
    }
  }

  ngAfterViewInit(): void {
    this.setupDocumentClickListener();
  }

  onToggleSideNav(data: SideNavToggle): void {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
    this.opened = !data.collapsed;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 768) {
      this.isSideNavCollapsed = true;
      this.opened = false;
    } else {
      this.isSideNavCollapsed = false;
      this.opened = true;
    }
  }

  setupDocumentClickListener(): void {
    document.addEventListener('click', this.onDocumentClick.bind(this));
  }

  onDocumentClick(event: Event): void {
    if (this.screenWidth <= 768 && this.opened) {
      const target = event.target as HTMLElement;
      if (this.sideNav && !this.sideNav.nativeElement.contains(target)) {
        this.closeSideNav();
      }
    }
  }

  closeSideNav(): void {
    this.opened = false;
    this.isSideNavCollapsed = true;
  }
}
