import { Routes } from '@angular/router';
import { BolivaresComponent } from './navbar/bolivares/bolivares.component';
import { BancolombiaComponent } from './navbar/bancolombia/bancolombia.component';
import { CajaComponent } from './navbar/caja/caja.component';
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { InicioComponent } from './pages/inicio/inicio.component';

export const routes: Routes = [
  {path:"",component:LoginComponent},
  {path:"registro",component:RegistroComponent},
  {path:"inicio",component:InicioComponent},
  {path: 'bolivares', component:BolivaresComponent},
  {path: 'bancolombia', component:BancolombiaComponent},
  {path: 'cajas', component:CajaComponent},
  { path: '', redirectTo: '/bolivares', pathMatch: 'full' }
];
