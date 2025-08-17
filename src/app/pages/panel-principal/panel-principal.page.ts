import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-panel-principal',
  templateUrl: './panel-principal.page.html',
  styleUrls: ['./panel-principal.page.scss'],
  standalone: false
})
export class PanelPrincipalPage implements OnInit {
  nombreUsuario: string = '';
  mensajeBienvenida: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      // Si no está logueado, redirige al login
      this.router.navigate(['/login']);
      return;
    }

    this.nombreUsuario = this.authService.getNombre() || '';
  }
}
