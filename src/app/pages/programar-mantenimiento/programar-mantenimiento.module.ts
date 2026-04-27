import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProgramarMantenimientoPageRoutingModule } from './programar-mantenimiento-routing.module';

import { ProgramarMantenimientoPage } from './programar-mantenimiento.page';

import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProgramarMantenimientoPageRoutingModule,
    ComponentsModule
  ],
  declarations: [ProgramarMantenimientoPage]
})
export class ProgramarMantenimientoPageModule {}
