import { Component } from '@angular/core';
import { NavbarComponent } from './navbar/navbar.component';
import { CajaComponent } from './caja/caja.component';
import { BolivaresComponent } from './bolivares/bolivares.component';
import { RouterOutlet, RouterModule } from '@angular/router';

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [
    NavbarComponent,
    CajaComponent,
    BolivaresComponent,
    RouterModule,RouterOutlet],
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.css'
})
export class PrincipalComponent {

}
