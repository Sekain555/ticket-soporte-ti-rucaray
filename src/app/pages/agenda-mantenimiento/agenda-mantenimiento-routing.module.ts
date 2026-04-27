import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AgendaMantenimientoPage } from './agenda-mantenimiento.page';

const routes: Routes = [
  {
    path: '',
    component: AgendaMantenimientoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgendaMantenimientoPageRoutingModule {}
