import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { SidebarPolaniaComponent } from '../sidebar-polania/sidebar-polania.component';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { Subscription } from 'rxjs';
import { WebSocketService } from '../../services/web-socket.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { NotificationDialogComponent } from './notification-dialog.component';

@Component({
  selector: 'app-body-side-nav',
  standalone: true,
  imports: [SidebarPolaniaComponent, RouterOutlet, CommonModule, MatIconModule, MatBadgeModule, MatButtonModule],
  templateUrl: './body-side-nav.component.html',
  styleUrl: './body-side-nav.component.css'
})
export class BodySideNavComponent implements OnInit, OnDestroy {
  @Input() collapsed = false;
  @Input() screenWidth = 0;

  notificationCount: number = 0;  // Inicializa el contador de notificaciones
  private notificationSubscription!: Subscription;  // Para almacenar la suscripción

  constructor(private webSocketService: WebSocketService, private dialog: MatDialog) {}

  ngOnInit(): void {
    // Conectar al WebSocket
    this.webSocketService.connect();

    // Inicializar el contador de notificaciones basado en el localStorage
    this.updateNotificationCount();

    // Suscribirse a las notificaciones desde el servicio WebSocket
    this.notificationSubscription = this.webSocketService.onNotification().subscribe(message => {
      // Lógica según el mensaje recibido
      if (message === "venta real") {
        this.handleVentaReal();
      } else if (message === "entrada conf") {
        this.handleEntradaConf();
      } else if (message === "salida ven") {
        this.handleSalidaVen();
      }

      // Actualizar el contador de notificaciones
      this.updateNotificationCount();
    });
  }

  // Actualizar el contador de notificaciones basado en localStorage
  updateNotificationCount(): void {
    this.notificationCount = 0;  // Reiniciar el contador

    // Verificar si la variable 'venta' está en localStorage
    if (localStorage.getItem('venta') !== null) {
      this.notificationCount++;
    }

    // Verificar si la variable 'salida' está en localStorage
    if (localStorage.getItem('salida') !== null) {
      this.notificationCount++;
    }
  }

  // Abrir el diálogo de notificaciones sin pasar un mensaje
  openNotificationDialog(): void {
    this.dialog.open(NotificationDialogComponent, {
      width: '400px'
    });
  }

  // Manejar el mensaje de "venta real"
  handleVentaReal(): void {
    console.log("Mensaje recibido: venta real");
    localStorage.setItem('venta', '1');  // Crear variable 'venta' con valor 1
  }

  // Manejar el mensaje de "entrada conf"
  handleEntradaConf(): void {
    console.log("Mensaje recibido: entrada conf");
    localStorage.removeItem('venta');  // Eliminar variable 'venta'
    localStorage.setItem('salida', '1');  // Crear variable 'salida' con valor 1
  }

  // Manejar el mensaje de "salida ven"
  handleSalidaVen(): void {
    console.log("Mensaje recibido: salida ven");
    localStorage.removeItem('salida');  // Eliminar variable 'salida'
  }

  // Desconectar la suscripción al salir del componente
  ngOnDestroy(): void {
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();  // Desuscribir para evitar fugas de memoria
    }
  }

  getBodyClass(): string {
    let styleClass = '';
    if (this.collapsed && this.screenWidth > 768) {
      styleClass = 'body-trimmed';
    } else if (this.collapsed && this.screenWidth <= 768 && this.screenWidth > 0) {
      styleClass = 'body-md-screen';
    }
    return styleClass;
  }
}
