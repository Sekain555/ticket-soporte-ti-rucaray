import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DispositivoService {
  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    if (!token) throw new Error('Usuario no autenticado');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  listarDispositivos(opts?: {
    tipo?: string;
    area?: string;
    limit?: number;
    offset?: number;
  }): Observable<any> {
    let params = new HttpParams();
    if (opts?.tipo) params = params.set('tipo', opts.tipo);
    if (opts?.area) params = params.set('area', opts.area);
    if (typeof opts?.limit === 'number') params = params.set('limit', String(opts.limit));
    if (typeof opts?.offset === 'number') params = params.set('offset', String(opts.offset));

    return this.http.get(`${environment.apiBaseUrl}/dispositivos/`, {
      headers: this.getHeaders(),
      params,
    });
  }

  obtenerDispositivoPorId(id_dispositivo: number): Observable<any> {
    return this.http.get(`${environment.apiBaseUrl}/dispositivos/${id_dispositivo}`, {
      headers: this.getHeaders(),
    });
  }

  crearDispositivo(data: any): Observable<any> {
    return this.http.post(`${environment.apiBaseUrl}/dispositivos/`, data, {
      headers: this.getHeaders(),
    });
  }

  actualizarDispositivo(id_dispositivo: number, data: any): Observable<any> {
    return this.http.patch(`${environment.apiBaseUrl}/dispositivos/${id_dispositivo}`, data, {
      headers: this.getHeaders(),
    });
  }
}