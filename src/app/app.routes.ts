import { Routes } from '@angular/router';
import { BolivaresComponent } from './index/principal/bolivares/bolivares.component';
import { CajaComponent } from './index/principal/caja/caja.component';
import { EfectivoComponent } from './index/principal/efectivo/efectivo.component';
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { DescripcionComponent } from './configuraciones/descripcion/descripcion.component';
import { AuthGuard } from './guards/auth.guard';
import { ContentPolaniaComponent } from './shared/content-polania/content-polania.component';
import { PrincipalComponent } from './index/principal/principal.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'registro',
    component: RegistroComponent
  },
  {
    path: 'index',
    component: ContentPolaniaComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: PrincipalComponent,
        children: [
          { path: 'bolivares', component: BolivaresComponent },
          { path: 'adicionales', component: CajaComponent },
          { path: 'efectivo', component: EfectivoComponent },
          { path: '', redirectTo: 'bolivares', pathMatch: 'full' }
        ]
      },
      { path: 'configuracion', component: DescripcionComponent }
    ]
  }
];
