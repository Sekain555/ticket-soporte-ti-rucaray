import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'panel-principal',
    loadChildren: () =>
      import('./pages/panel-principal/panel-principal.module').then(
        (m) => m.PanelPrincipalPageModule,
      ),
  },
  {
    path: 'nuevo-ticket',
    loadChildren: () =>
      import('./pages/nuevo-ticket/nuevo-ticket.module').then(
        (m) => m.NuevoTicketPageModule,
      ),
  },
  {
    path: 'mis-tickets',
    loadChildren: () =>
      import('./pages/mis-tickets/mis-tickets.module').then(
        (m) => m.MisTicketsPageModule,
      ),
  },
  {
    path: 'detalle-ticket/:id_ticket',
    loadChildren: () =>
      import('./pages/detalle-ticket/detalle-ticket.module').then(
        (m) => m.DetalleTicketPageModule,
      ),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'agenda-mantenimiento',
    loadChildren: () =>
      import('./pages/agenda-mantenimiento/agenda-mantenimiento.module').then(
        (m) => m.AgendaMantenimientoPageModule,
      ),
  },
  {
    path: 'programar-mantenimiento',
    loadChildren: () =>
      import('./pages/programar-mantenimiento/programar-mantenimiento.module').then(
        (m) => m.ProgramarMantenimientoPageModule,
      ),
  },
  {
    path: 'detalle-agenda-mant/:id_mantencion',
    loadChildren: () =>
      import('./pages/detalle-agenda-mant/detalle-agenda-mant.module').then(
        (m) => m.DetalleAgendaMantPageModule,
      ),
  },
  {
    path: 'listado-dispositivos',
    loadChildren: () =>
      import('./pages/listado-dispositivos/listado-dispositivos.module').then(
        (m) => m.ListadoDispositivosPageModule,
      ),
  },
  {
    path: 'detalle-dispositivo',
    loadChildren: () =>
      import('./pages/detalle-dispositivo/detalle-dispositivo.module').then(
        (m) => m.DetalleDispositivoPageModule,
      ),
  },
  {
    path: 'listado-dispositivos',
    loadChildren: () =>
      import('./pages/listado-dispositivos/listado-dispositivos.module').then(
        (m) => m.ListadoDispositivosPageModule,
      ),
  },
  {
    path: 'detalle-dispositivo/:id_dispositivo',
    loadChildren: () =>
      import('./pages/detalle-dispositivo/detalle-dispositivo.module').then(
        (m) => m.DetalleDispositivoPageModule,
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
