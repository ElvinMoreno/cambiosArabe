import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarPolaniaComponent } from './shared/navbar-polania/navbar-polania.component';
import { SidebarPolaniaComponent } from './shared/sidebar-polania/sidebar-polania.component';
import { ContentPolaniaComponent } from './shared/content-polania/content-polania.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FormControl, FormsModule, ReactiveFormsModule, Validator } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,
    ContentPolaniaComponent,
    NavbarPolaniaComponent,
    SidebarPolaniaComponent,
    MatSidenavModule, FormsModule, ReactiveFormsModule,MatInputModule,MatFormFieldModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'entrada-Bolivares';
 ;
}
