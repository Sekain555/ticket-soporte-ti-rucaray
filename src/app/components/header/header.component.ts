import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false,
})
export class HeaderComponent implements OnInit {
  @Input() mostrarBackButton: boolean = false;

  constructor(
    private router: Router,
    private actionSheetCtrl: ActionSheetController
  ) {}

  ngOnInit() {}

  async abrirMenuUsuario() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Opciones de usuario',
      buttons: [
        {
          text: 'Cerrar sesión',
          icon: 'log-out-outline',
          handler: () => {
            this.cerrarSesion();
          },
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
    // Eliminar token del storage o localStorage
    localStorage.removeItem('access_token');

    // Redirigir al login
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
