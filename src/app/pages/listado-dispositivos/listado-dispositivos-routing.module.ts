import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListadoDispositivosPage } from './listado-dispositivos.page';

const routes: Routes = [
  {
    path: '',
    component: ListadoDispositivosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListadoDispositivosPageRoutingModule {}
