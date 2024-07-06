import { Routes } from '@angular/router';
import { BolivaresComponent } from './navbar/bolivares/bolivares.component';
import { BancolombiaComponent } from './navbar/bancolombia/bancolombia.component';
import { CajaComponent } from './navbar/caja/caja.component';

export const routes: Routes = [
  {path: 'bolivares', component:BolivaresComponent},
  {path: 'bancolombia', component:BancolombiaComponent},
  {path: 'cajas', component:CajaComponent},
  { path: '', redirectTo: '/bolivares', pathMatch: 'full' }
];
