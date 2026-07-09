import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { HeaderComponent } from './header/header.component';
import { NotificacionesPopoverComponent } from './notificaciones-popover/notificaciones-popover.component';
import { MencionarUsuarioModalComponent } from './mencionar-usuario-modal/mencionar-usuario-modal.component';

@NgModule({
  declarations: [HeaderComponent, NotificacionesPopoverComponent, MencionarUsuarioModalComponent],
  imports: [CommonModule, IonicModule],
  exports: [HeaderComponent, NotificacionesPopoverComponent, MencionarUsuarioModalComponent],
})
export class ComponentsModule {}
