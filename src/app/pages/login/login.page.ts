import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {

  usuario: string = '';
  contrasena: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
  }

  async loginUser() {
    this.authService.login(this.usuario, this.contrasena).subscribe({
      next: async () => {
        // Redirige al dashboard o página principal según rol
        const rol = this.authService.getRol();
        if(rol === 'admin') {
          this.router.navigate(['/panel-principal']);
        } else if(rol === 'soporte') {
          this.router.navigate(['/panel-principal']);
        } else {
          this.router.navigate(['/panel-principal']);
        }
      },
      error: async () => {
        const toast = await this.toastCtrl.create({
          message: 'Usuario o contraseña incorrectos',
          duration: 3000,
          color: 'danger'
        });
        await toast.present();
      }
    });
  }

}
