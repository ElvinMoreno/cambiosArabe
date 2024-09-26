import { Component, inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { SidebarPolaniaComponent } from './shared/sidebar-polania/sidebar-polania.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AccesoService } from './services/acceso.service';

import {CloudinaryModule} from '@cloudinary/ng';
import {fill} from "@cloudinary/url-gen/actions/resize";
import { WebSocketService } from './services/web-socket.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatSidenavModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    CommonModule,
    SidebarPolaniaComponent,
    CloudinaryModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'entrada-Bolivares';
  private accesoService = inject(AccesoService);

  constructor(private webSocketService: WebSocketService) {}

  ngOnInit(): void {
    this.webSocketService.connect();
  }

  // Si necesitas enviar un mensaje
  sendMessage() {
    const message = { text: 'Hola desde Angular' };
    this.webSocketService.sendMessage(message);
  }
  isAuthenticated() {
    return this.accesoService.isAuthenticated();
  }
}
