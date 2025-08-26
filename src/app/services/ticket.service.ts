import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TicketService {
  private apiUrl = 'http://127.0.0.1:8000';

  constructor(private http: HttpClient, private authService: AuthService) {}

  crearTicket(
    titulo: string,
    descripcion: string,
    tipo_problema: string,
    prioridad: string,
    dispositivo?: string
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
      tipo_problema,
      prioridad,
    };

    if (dispositivo) {
      body.dispositivo = dispositivo;
    }

    return this.http.post(`${this.apiUrl}/tickets/`, body, { headers });
  }

  listarTickets(): Observable<any> {
    const token = this.authService.getToken();
    if (!token) throw new Error('Usuario no autenticado');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get(`${this.apiUrl}/tickets/`, { headers });
  }

  obtenerTicketPorId(id_ticket: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/tickets/${id_ticket}/`);
  }

  // Obtener feed de un ticket
  obtenerFeed(id_ticket: string): Observable<any> {
    const token = this.authService.getToken();
    if (!token) throw new Error('Usuario no autenticado');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get(`${this.apiUrl}/tickets/${id_ticket}/feed`, {
      headers,
    });
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

    return this.http.post(`${this.apiUrl}/tickets/${id_ticket}/feed`, body, {
      headers,
    });
  }
}
