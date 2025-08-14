import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MisTicketsPageRoutingModule } from './mis-tickets-routing.module';

import { MisTicketsPage } from './mis-tickets.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MisTicketsPageRoutingModule,
    ComponentsModule
  ],
  declarations: [MisTicketsPage]
})
export class MisTicketsPageModule {}
