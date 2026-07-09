import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    if (!token) throw new Error('Usuario no autenticado');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  listarTecnicos(): Observable<any> {
    let params = new HttpParams();
    params = params.set('rol', 'soporte');
    return this.http.get(`${environment.apiBaseUrl}/usuarios`, {
      headers: this.getHeaders(),
      params,
    });
  }

  listarAdminsYTecnicos(): Observable<any> {
    let params = new HttpParams();
    params = params.set('rol', 'tecnicos');
    return this.http.get(`${environment.apiBaseUrl}/usuarios`, {
      headers: this.getHeaders(),
      params,
    });
  }

  listarTodos(): Observable<any> {
    return this.http.get(`${environment.apiBaseUrl}/usuarios`, {
      headers: this.getHeaders(),
    });
  }
}
