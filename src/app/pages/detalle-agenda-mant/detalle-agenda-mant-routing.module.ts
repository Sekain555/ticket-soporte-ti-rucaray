import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetalleAgendaMantPage } from './detalle-agenda-mant.page';

const routes: Routes = [
  {
    path: '',
    component: DetalleAgendaMantPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetalleAgendaMantPageRoutingModule {}
