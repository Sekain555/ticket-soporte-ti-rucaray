import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetalleAgendaMantPageRoutingModule } from './detalle-agenda-mant-routing.module';

import { DetalleAgendaMantPage } from './detalle-agenda-mant.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetalleAgendaMantPageRoutingModule
  ],
  declarations: [DetalleAgendaMantPage]
})
export class DetalleAgendaMantPageModule {}
