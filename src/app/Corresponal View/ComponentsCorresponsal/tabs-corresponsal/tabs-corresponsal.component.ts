import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-tabs-corresponsal',
  standalone: true,
  imports: [CommonModule, MatTabsModule],
  template: `
    <mat-tab-group mat-stretch-tabs="false" mat-align-tabs="center">
      <mat-tab *ngFor="let tab of tabs" [label]="tab.label">
        <ng-container *ngIf="tab.contentTemplate">
          <!-- Renderizar contenido dinámico desde un Template -->
          <ng-container *ngTemplateOutlet="tab.contentTemplate"></ng-container>
        </ng-container>
        <ng-container *ngIf="!tab.contentTemplate">
          <!-- Renderizar contenido estático -->
          {{ tab.content }}
        </ng-container>
      </mat-tab>
    </mat-tab-group>
  `,
  styleUrls: ['./tabs-corresponsal.component.css'],
})
export class TabsCorresponsalComponent {
  @Input() tabs: Array<{ label: string; content?: string; contentTemplate?: any }> = [];
}
