import { Component, Input} from '@angular/core';
import { SidebarPolaniaComponent } from '../sidebar-polania/sidebar-polania.component';
import { Router, RouterOutlet } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-body-side-nav',
  standalone: true,
  imports: [SidebarPolaniaComponent,
    RouterOutlet,
    CommonModule],
  templateUrl: './body-side-nav.component.html',
  styleUrl: './body-side-nav.component.css'
})
export class BodySideNavComponent {
  @Input() collapsed = false;
  @Input() screenWidth = 0;

  getBodyClass(): string{
    let styleClass='';
    if(this.collapsed && this.screenWidth > 768){
      styleClass='body-trimmed'
    } else if(this.collapsed && this.screenWidth <= 768 && this.screenWidth > 0){
      styleClass='body-md-screen'
    }
    return styleClass;
  }

}
