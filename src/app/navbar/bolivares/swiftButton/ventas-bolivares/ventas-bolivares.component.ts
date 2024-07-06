import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';


@Component({
  selector: 'ventas-bolivares',
  standalone: true,
  imports: [MatButtonModule,CommonModule],
  templateUrl: './ventas-bolivares.component.html',
  styleUrl: './ventas-bolivares.component.css'
})
export class VentasBolivaresComponent {

}
