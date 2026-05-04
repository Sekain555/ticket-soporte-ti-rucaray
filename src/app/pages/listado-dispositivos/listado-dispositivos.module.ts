import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListadoDispositivosPageRoutingModule } from './listado-dispositivos-routing.module';
import { ComponentsModule } from 'src/app/components/components.module';

import { ListadoDispositivosPage } from './listado-dispositivos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListadoDispositivosPageRoutingModule,
    ComponentsModule,
  ],
  declarations: [ListadoDispositivosPage]
})
export class ListadoDispositivosPageModule {}
