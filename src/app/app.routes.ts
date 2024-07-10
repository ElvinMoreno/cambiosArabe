import { Routes } from '@angular/router';
import { BolivaresComponent } from './navbar/bolivares/bolivares.component';
import { BancolombiaComponent } from './navbar/bancolombia/bancolombia.component';
import { CajaComponent } from './navbar/caja/caja.component';
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {path:"login",component:LoginComponent},
  {path:"registro",component:RegistroComponent},
  {path:"inicio",component:InicioComponent,canActivate: [AuthGuard]},
  {path: 'bolivares', component:BolivaresComponent, canActivate: [AuthGuard]},
  {path: 'bancolombia', component:BancolombiaComponent, canActivate: [AuthGuard]},
  {path: 'cajas', component:CajaComponent, canActivate: [AuthGuard]},
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
