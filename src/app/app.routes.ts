import { Routes } from '@angular/router';
import { BolivaresComponent } from './index/principal/bolivares/bolivares.component';
import { CajaComponent } from './index/principal/caja/caja.component';
import { EfectivoComponent } from './index/principal/efectivo/efectivo.component';
import { LoginComponent } from './pages/login/login.component';
import { DescripcionComponent } from './configuraciones/configuracion/switchbutton/descripcion/descripcion.component';
import { ContentPolaniaComponent } from './shared/content-polania/content-polania.component';
import { AuthGuard } from './guards/auth.guard';
import { PrincipalComponent } from './index/principal/principal.component';
import { CuentaBancariaComponent } from './cuentaBancaria/cuenta-bancaria/cuenta-bancaria.component';
import { DetalleDavidplataComponent } from './cuentaBancaria/detalle-Cuenta/detalle-davidplata/detalle-davidplata.component';
import { DetalleBancolombia1Component } from './cuentaBancaria/detalle-Cuenta/detalle-bancolombia1/detalle-bancolombia1.component';
import { DetalleBancolombia2Component } from './cuentaBancaria/detalle-Cuenta/detalle-bancolombia2/detalle-bancolombia2.component';
import { DetalleMovimientoDavidplataComponent } from './cuentaBancaria/detalle-Cuenta/detalle-davidplata/detalle-movimiento/detalle-movimiento-davidplata/detalle-movimiento-davidplata.component';
import { DetalleMovimientoBancolombia1Component } from './cuentaBancaria/detalle-Cuenta/detalle-bancolombia1/detalle-movimiento/detalle-movimiento-bancolombia1/detalle-movimiento-bancolombia1.component';
import { DetalleMovimientoBancolombia2Component } from './cuentaBancaria/detalle-Cuenta/detalle-bancolombia2/detalle-movimiento/detalle-movimiento-bancolombia2/detalle-movimiento-bancolombia2.component';
import { ConfiguracionComponent } from './configuraciones/configuracion/configuracion.component';
import { UsuariosComponent } from './usuarios/usuarios.component';

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
      { path: 'configuracion', component: ConfiguracionComponent },
      { path: 'detalle-davidplata', component: DetalleDavidplataComponent },
      {
        path: 'cuentaBancaria', component: CuentaBancariaComponent
      },
      { path: 'detalle-bancolombia1', component: DetalleBancolombia1Component },
      { path: 'detalle-bancolombia2', component: DetalleBancolombia2Component },
      { path: 'detalle-movimiento-davidplata', component: DetalleMovimientoDavidplataComponent },
      { path: 'detalle-movimiento-bancolombia1', component: DetalleMovimientoBancolombia1Component},
      {path: 'detalle-movimiento-bancolombia2', component: DetalleMovimientoBancolombia2Component},
      {path: 'proveedores', component: UsuariosComponent}
    ]
  }
];
