import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000';

  constructor(private http: HttpClient) {}

  login(usuario: string, contraseña: string) {
    return this.http
      .post<{
        access_token: string;
        token_type: string;
        user: {
          id: number;
          nombre: string;
          apellido: string;
          correo: string;
          usuario: string;
          rol: string;
        };
      }>(`${this.apiUrl}/login`, {
        usuario,
        contraseña,
      })
      .pipe(
        tap((res) => {
          const user = res.user;
          localStorage.setItem('token', res.access_token);
          localStorage.setItem('id_usuario', user.id.toString());
          localStorage.setItem('nombre', user.nombre);
          localStorage.setItem('apellido', user.apellido);
          localStorage.setItem('correo', user.correo);
          localStorage.setItem('usuario', user.usuario);
          localStorage.setItem('rol', user.rol);

          if (user.id === 1) {
            localStorage.setItem('tema', 'theme-especial');
          } else {
            localStorage.setItem('tema', 'theme-default');
          }
        })
      );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getIdUsuario() {
    return localStorage.getItem('id_usuario');
  }

  getNombre() {
    return localStorage.getItem('nombre');
  }

  getApellido() {
    return localStorage.getItem('apellido');
  }

  getCorreo() {
    return localStorage.getItem('correo');
  }

  getUsuario() {
    return localStorage.getItem('usuario');
  }

  getRol() {
    return localStorage.getItem('rol');
  }

  isLoggedIn() {
    return !!this.getToken();
  }
}
