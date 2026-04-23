import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MantencionService {
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

  crearMantencion(
    titulo: string,
    fecha_propuesta: string,
    hora_inicio: string,
    hora_fin: string,
    descripcion?: string,
  ): Observable<any> {
    const body: any = { titulo, fecha_propuesta, hora_inicio, hora_fin };
    if (descripcion) body.descripcion = descripcion;

    return this.http.post(`${environment.apiBaseUrl}/mantenciones/`, body, {
      headers: this.getHeaders(),
    });
  }

  listarMantenciones(opts?: {
    estado?: string;
    limit?: number;
    offset?: number;
  }): Observable<any> {
    let params = new HttpParams();
    if (opts?.estado) params = params.set('estado', opts.estado);
    if (typeof opts?.limit === 'number')
      params = params.set('limit', String(opts.limit));
    if (typeof opts?.offset === 'number')
      params = params.set('offset', String(opts.offset));

    return this.http.get(`${environment.apiBaseUrl}/mantenciones/`, {
      headers: this.getHeaders(),
      params,
    });
  }

  obtenerMantencionPorId(id_mantencion: number): Observable<any> {
    return this.http.get(
      `${environment.apiBaseUrl}/mantenciones/${id_mantencion}`,
      { headers: this.getHeaders() },
    );
  }

  actualizarEstadoMantencion(
    id_mantencion: number,
    nuevo_estado: string,
    notas_soporte?: string,
  ): Observable<any> {
    const body: any = { nuevo_estado };
    if (notas_soporte) body.notas_soporte = notas_soporte;

    return this.http.patch(
      `${environment.apiBaseUrl}/mantenciones/${id_mantencion}/estado`,
      body,
      { headers: this.getHeaders() },
    );
  }

  obtenerFeedMantencion(id_mantencion: number): Observable<any> {
    return this.http.get(
      `${environment.apiBaseUrl}/mantenciones/${id_mantencion}/feed`,
      { headers: this.getHeaders() },
    );
  }

  agregarComentarioMantencion(
    id_mantencion: number,
    comentario: string,
  ): Observable<any> {
    return this.http.post(
      `${environment.apiBaseUrl}/mantenciones/${id_mantencion}/feed`,
      { comentario },
      { headers: this.getHeaders() },
    );
  }
}
