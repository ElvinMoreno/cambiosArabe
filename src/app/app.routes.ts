import { Routes } from '@angular/router';


import { BolivaresComponent } from './index/bolivares/bolivares.component';
import { CajaComponent } from './index/caja/caja.component';
import { EfectivoComponent } from './index/efectivo/efectivo.component';
import { NavbarComponent } from './index/navbar/navbar.component';
import { DescripcionComponent } from './configuraciones/descripcion/descripcion.component';
export const routes: Routes = [
  {
    path: '',
    component: NavbarComponent,
    children: [
      { path: 'bolivares', component: BolivaresComponent },
      { path: 'adicionales', component: CajaComponent },
      { path: 'efectivo', component: EfectivoComponent },
      { path: '', redirectTo: 'bolivares', pathMatch: 'full' }
    ]
  },
  { path: 'configuracion', component: DescripcionComponent },
  {
    path: 'index',
    component: NavbarComponent,
    children: [
      { path: 'bolivares', component: BolivaresComponent },
      { path: 'adicionales', component: CajaComponent },
      { path: 'efectivo', component: EfectivoComponent },
      { path: '', redirectTo: 'bolivares', pathMatch: 'full' }
    ]
  }

];
