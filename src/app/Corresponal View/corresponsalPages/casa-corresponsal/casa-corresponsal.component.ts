import { Component, ViewChild, TemplateRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsCorresponsalComponent } from '../../ComponentsCorresponsal/tabs-corresponsal/tabs-corresponsal.component';
import { UsdtCasaCorresponsalComponent } from '../../ComponentsCorresponsal/usdt-casa-corresponsal/usdt-casa-corresponsal.component';
import { COPCasaCorresponsalComponent } from '../../ComponentsCorresponsal/copcasa-corresponsal/copcasa-corresponsal.component';

@Component({
  selector: 'app-casa-corresponsal',
  standalone: true,
  imports: [ CommonModule,
    TabsCorresponsalComponent, // Importa el componente de tabs
    UsdtCasaCorresponsalComponent, // Importa los componentes de contenido
    TabsCorresponsalComponent,
    COPCasaCorresponsalComponent
  ],
  templateUrl: './casa-corresponsal.component.html',
  styleUrl: './casa-corresponsal.component.css'
})
export class CasaCorresponsalComponent {
  @ViewChild('usdtContent') usdtContent!: TemplateRef<any>;
  @ViewChild('copContent') copContent!: TemplateRef<any>;

  tabs: Array<{ label: string; contentTemplate?: TemplateRef<any> }> = [];

  ngAfterViewInit(): void {
    this.tabs = [
      { label: 'USDT', contentTemplate: this.usdtContent },
      { label: 'COP', contentTemplate: this.copContent },
    ];
  }
}
