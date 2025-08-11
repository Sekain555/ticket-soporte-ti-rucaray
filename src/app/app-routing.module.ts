import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'panel-principal',
    pathMatch: 'full'
  },
  {
    path: 'panel-principal',
    loadChildren: () => import('./pages/panel-principal/panel-principal.module').then( m => m.PanelPrincipalPageModule)
  },
  {
    path: 'nuevo-ticket',
    loadChildren: () => import('./pages/nuevo-ticket/nuevo-ticket.module').then( m => m.NuevoTicketPageModule)
  },
  {
    path: 'mis-tickets',
    loadChildren: () => import('./pages/mis-tickets/mis-tickets.module').then( m => m.MisTicketsPageModule)
  },
  {
    path: 'detalle-ticket',
    loadChildren: () => import('./pages/detalle-ticket/detalle-ticket.module').then( m => m.DetalleTicketPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
