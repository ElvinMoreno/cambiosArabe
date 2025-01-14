import { Routes } from '@angular/router';
import { BolivaresComponent } from './operaciones/principal/bolivares/bolivares.component';
import { CajaComponent } from './operaciones/principal/caja/caja.component';
import { LoginComponent } from './pages/login/login.component';
import { ContentPolaniaComponent } from './shared/content-polania/content-polania.component';
import { AuthGuard } from './guards/auth.guard';
import { PrincipalComponent } from './operaciones/principal/principal.component';
import { CuentaBancariaComponent } from './cuentaBancaria/cuenta-bancaria/cuenta-bancaria.component';
import { ConfiguracionComponent } from './configuraciones/configuracion/configuracion.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { TasaComponent } from './tasa/tasa.component';
import { MovimientosComponent } from './movimientos/movimientos.component';
import { IndexComponent } from './index/index.component';
import { CasaCorresponsalComponent } from './Corresponal View/corresponsalPages/casa-corresponsal/casa-corresponsal.component';

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
    path: 'operaciones',
    component: ContentPolaniaComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: PrincipalComponent,
        children: [
          { path: 'bolivares', component: BolivaresComponent },
          { path: 'adicionales', component: CajaComponent },
          { path: '', redirectTo: 'bolivares', pathMatch: 'full' }
        ]
      },
      { path: 'index', component: IndexComponent },
      { path: 'tasa', component: TasaComponent },
      { path: 'configuracion', component: ConfiguracionComponent },
      { path: 'cuentaBancaria', component: CuentaBancariaComponent },
      { path: 'proveedores', component: UsuariosComponent },
      { path: 'movimientos', component: MovimientosComponent },
      { path: 'home', component: CasaCorresponsalComponent }
    ]
  },

];
