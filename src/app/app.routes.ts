import { Routes } from '@angular/router';


import { BolivaresComponent } from './index/bolivares/bolivares.component';
import { CajaComponent } from './index/caja/caja.component';
import { EfectivoComponent } from './index/efectivo/efectivo.component';
import { NavbarComponent } from './index/navbar/navbar.component';
import { DescripcionComponent } from './configuraciones/descripcion/descripcion.component';
import { CuentaBancariaComponent } from './cuentaBancaria/cuenta-bancaria/cuenta-bancaria.component';
import { DetalleDavidplataComponent } from './cuentaBancaria/detalle-Cuenta/detalle-davidplata/detalle-davidplata.component';
import { DetalleBancolombia1Component } from './cuentaBancaria/detalle-Cuenta/detalle-bancolombia1/detalle-bancolombia1.component';
import { DetalleBancolombia2Component } from './cuentaBancaria/detalle-Cuenta/detalle-bancolombia2/detalle-bancolombia2.component';
import { DetalleMovimientoDavidplataComponent } from './cuentaBancaria/detalle-Cuenta/detalle-davidplata/detalle-movimiento/detalle-movimiento-davidplata/detalle-movimiento-davidplata.component';
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
  },
  {
    path: 'cuentaBancaria',
    component: CuentaBancariaComponent,

  },

  { path: 'detalle-davidplata', component: DetalleDavidplataComponent },
  { path: 'detalle-bancolombia1', component: DetalleBancolombia1Component },
   { path: 'detalle-bancolombia2', component: DetalleBancolombia2Component },
   { path: 'detalle-movimiento-davidplata',
    component:DetalleMovimientoDavidplataComponent}

];
