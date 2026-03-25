import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TicketService {
  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  crearTicket(
    titulo: string,
    descripcion: string,
    prioridad: string,
    dispositivo?: string,
    tipo_problema?: string,
  ): Observable<any> {
    const token = this.authService.getToken();
    if (!token) throw new Error('Usuario no autenticado');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // enviamos el token al backend
    });

    const body: any = {
      titulo,
      descripcion,
      prioridad,
    };

    if (tipo_problema) {
      body.tipo_problema = tipo_problema;
    }

    if (dispositivo) {
      body.dispositivo = dispositivo;
    }

    return this.http.post(`${environment.apiBaseUrl}/tickets/`, body, {
      headers,
    });
  }

  listarTickets(opts?: {
    sort_by?: string;
    order?: 'asc' | 'desc';
    estado?: 'todos' | 'abierto' | 'en_progreso' | 'resuelto' | 'cerrado';
    limit?: number;
    offset?: number;
  }): Observable<any> {
    const token = this.authService.getToken();
    if (!token) throw new Error('Usuario no autenticado');

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    let params = new HttpParams();
    if (opts?.sort_by) params = params.set('sort_by', opts.sort_by);
    if (opts?.order) params = params.set('order', opts.order);
    if (opts?.estado && opts.estado !== 'todos') {
      params = params.set('estado', opts.estado);
    }
    const limit = opts?.limit ?? 10;
    if (typeof opts?.limit === 'number') {
      params = params.set('limit', String(opts.limit));
    }
    if (typeof opts?.offset === 'number') {
      params = params.set('offset', String(opts.offset));
    }

    return this.http.get(`${environment.apiBaseUrl}/tickets/`, {
      headers,
      params,
    });
  }

  obtenerTicketPorId(id_ticket: string): Observable<any> {
    return this.http.get(`${environment.apiBaseUrl}/tickets/${id_ticket}`);
  }

  // Obtener feed de un ticket
  obtenerFeed(id_ticket: string): Observable<any> {
    const token = this.authService.getToken();
    if (!token) throw new Error('Usuario no autenticado');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get(
      `${environment.apiBaseUrl}/tickets/${id_ticket}/feed`,
      {
        headers,
      },
    );
  }

  // Agregar un comentario al feed de un ticket
  agregarComentario(id_ticket: string, comentario: string): Observable<any> {
    const token = this.authService.getToken();
    if (!token) throw new Error('Usuario no autenticado');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    const body = {
      id_usuario: this.authService.getIdUsuario(),
      comentario: comentario,
    };

    return this.http.post(
      `${environment.apiBaseUrl}/tickets/${id_ticket}/feed`,
      body,
      {
        headers,
      },
    );
  }

  cambiarEstadoTicket(
    id_ticket: string,
    nuevoEstado: string,
    comentario: string,
  ): Observable<any> {
    const token = this.authService.getToken();
    if (!token) throw new Error('Usuario no autenticado');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    const body = {
      nuevo_estado: nuevoEstado,
      comentario: comentario,
    };

    return this.http.patch(
      `${environment.apiBaseUrl}/tickets/${id_ticket}/estado`,
      body,
      { headers },
    );
  }

  actualizarTipoProblema(
    id_ticket: string,
    tipo_problema: string,
  ): Observable<any> {
    const token = this.authService.getToken();
    if (!token) throw new Error('Usuario no autenticado');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    const body = {
      tipo_problema,
    };

    return this.http.patch(
      `${environment.apiBaseUrl}/tickets/${id_ticket}/tipo-problema`,
      body,
      { headers },
    );
  }
}
