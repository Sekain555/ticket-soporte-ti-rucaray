import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, PopoverController } from '@ionic/angular';
import { NotificacionService } from 'src/app/services/notificacion.service';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
import { NotificacionesPopoverComponent } from '../notificaciones-popover/notificaciones-popover.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false,
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() mostrarBackButton: boolean = false;
  noLeidas: number = 0;
  private sub: Subscription | null = null;

  constructor(
    private router: Router,
    private actionSheetCtrl: ActionSheetController,
    private notificacionService: NotificacionService,
    private authService: AuthService,
    private popoverCtrl: PopoverController,
  ) {}

  ngOnInit() {
    this.sub = this.notificacionService.noLeidas$.subscribe(
      (n) => (this.noLeidas = n),
    );
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  async abrirNotificaciones(event: Event) {
    const popover = await this.popoverCtrl.create({
      component: NotificacionesPopoverComponent,
      event,
      dismissOnSelect: false,
      cssClass: 'notif-popover-rounded',
    });
    await popover.present();
  }

  async abrirMenuUsuario() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Opciones de usuario',
      buttons: [
        {
          text: 'Cerrar sesión',
          icon: 'log-out-outline',
          handler: () => this.cerrarSesion(),
        },
        {
          text: 'Cancelar',
          icon: 'close-outline',
          role: 'cancel',
        },
      ],
    });
    await actionSheet.present();
  }

  cerrarSesion() {
    this.notificacionService.detenerPolling();
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  volver() {
    const currentUrl = this.router.url;
    if (currentUrl.startsWith('/detalle-ticket')) {
      this.router.navigate(['/mis-tickets']);
    } else if (currentUrl.startsWith('/nuevo-ticket')) {
      this.router.navigate(['/panel-principal']);
    } else if (currentUrl.startsWith('/mis-tickets')) {
      this.router.navigate(['/panel-principal']);
    } else {
      this.router.navigate(['/panel-principal']);
    }
  }
}
