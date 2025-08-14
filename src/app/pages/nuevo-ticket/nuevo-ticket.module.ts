import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NuevoTicketPageRoutingModule } from './nuevo-ticket-routing.module';

import { NuevoTicketPage } from './nuevo-ticket.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NuevoTicketPageRoutingModule,
    ComponentsModule
  ],
  declarations: [NuevoTicketPage]
})
export class NuevoTicketPageModule {}
