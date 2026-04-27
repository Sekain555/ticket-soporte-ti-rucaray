import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProgramarMantenimientoPage } from './programar-mantenimiento.page';

const routes: Routes = [
  {
    path: '',
    component: ProgramarMantenimientoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProgramarMantenimientoPageRoutingModule {}
