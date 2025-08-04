import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PanelPrincipalPageRoutingModule } from './panel-principal-routing.module';

import { PanelPrincipalPage } from './panel-principal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PanelPrincipalPageRoutingModule
  ],
  declarations: [PanelPrincipalPage]
})
export class PanelPrincipalPageModule {}
