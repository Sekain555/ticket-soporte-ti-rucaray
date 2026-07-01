import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { HeaderComponent } from './header/header.component';
import { NotificacionesPopoverComponent } from './notificaciones-popover/notificaciones-popover.component';

@NgModule({
  declarations: [HeaderComponent, NotificacionesPopoverComponent],
  imports: [CommonModule, IonicModule],
  exports: [HeaderComponent, NotificacionesPopoverComponent],
})
export class ComponentsModule {}
