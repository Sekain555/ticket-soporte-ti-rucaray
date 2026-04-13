import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AgendaMantenimientoPageRoutingModule } from './agenda-mantenimiento-routing.module';

import { AgendaMantenimientoPage } from './agenda-mantenimiento.page';

import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgendaMantenimientoPageRoutingModule,
    ComponentsModule
  ],
  declarations: [AgendaMantenimientoPage]
})
export class AgendaMantenimientoPageModule {}
