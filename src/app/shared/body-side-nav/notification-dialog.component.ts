import { MatIconModule } from '@angular/material/icon';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notification-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule, CommonModule],
  template: `
    <h2 mat-dialog-title>Notificaciones</h2>
    <mat-dialog-content>

      <!-- Sección de "Ventas por Confirmar" -->
      <div *ngIf="ventaExists" class="notification-item">
        <p>Ventas por Confirmar</p>
        <div class="button-group">
          <button mat-icon-button color="primary" (click)="confirmVenta()">
            <mat-icon>check</mat-icon>
          </button>
          <button mat-icon-button color="warn" (click)="deleteVenta()">
            <mat-icon>delete</mat-icon>
          </button>
        </div>
      </div>

      <!-- Sección de "Ventas por Realizar" -->
      <div *ngIf="salidaExists" class="notification-item">
        <p>Ventas por Realizar</p>
        <div class="button-group">
          <button mat-icon-button color="primary" (click)="realizarVenta()">
            <mat-icon>check</mat-icon>
          </button>
          <button mat-icon-button color="warn" (click)="deleteVentaReal()">
            <mat-icon>delete</mat-icon>
          </button>
        </div>
      </div>

      <!-- Si no hay notificaciones, mostrar un mensaje -->
      <div *ngIf="!ventaExists && !salidaExists">
        <p>No hay notificaciones disponibles.</p>
      </div>

    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cerrar</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .notification-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .button-group {
      display: flex;
      gap: 10px;
    }
  `]
})
export class NotificationDialogComponent {

  ventaExists = false;
  salidaExists = false;

  constructor(public dialogRef: MatDialogRef<NotificationDialogComponent>) {
    // Verificar si las variables 'venta' o 'salida' existen en localStorage
    this.ventaExists = localStorage.getItem('venta') !== null;
    this.salidaExists = localStorage.getItem('salida') !== null;
  }

  // Método para confirmar la venta
  confirmVenta() {
    console.log('Venta confirmada');
    localStorage.removeItem('venta');
    this.ventaExists = false;
    this.dialogRef.close();  // Cierra el modal después de la acción
  }

  // Método para eliminar la venta por confirmar
  deleteVenta() {
    console.log('Venta eliminada');
    localStorage.removeItem('venta');
    this.ventaExists = false;
    this.dialogRef.close();  // Cierra el modal después de la acción
  }

  // Método para realizar la venta
  realizarVenta() {
    console.log('Venta realizada');
    localStorage.removeItem('salida');
    this.salidaExists = false;
    this.dialogRef.close();  // Cierra el modal después de la acción
  }

  // Método para eliminar la venta por realizar
  deleteVentaReal() {
    console.log('Venta por realizar eliminada');
    localStorage.removeItem('salida');
    this.salidaExists = false;
    this.dialogRef.close();  // Cierra el modal después de la acción
  }
}
