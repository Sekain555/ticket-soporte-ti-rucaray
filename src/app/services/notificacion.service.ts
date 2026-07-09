import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable, BehaviorSubject, interval, Subscription } from 'rxjs';
import { switchMap, distinctUntilChanged } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NotificacionService {
  private noLeidasSubject = new BehaviorSubject<number>(0);
  noLeidas$ = this.noLeidasSubject.asObservable();

  private pollingSubscription: Subscription | null = null;

  private audio = new Audio('assets/sounds/notificacion.wav');

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    if (!token) throw new Error('Usuario no autenticado');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  iniciarPolling() {
    if (this.pollingSubscription) return;
    this.verificarNoLeidas();
    this.pollingSubscription = interval(30000).subscribe(() => {
      if (this.authService.isLoggedIn()) {
        this.verificarNoLeidas();
      }
    });
  }

  detenerPolling() {
    this.pollingSubscription?.unsubscribe();
    this.pollingSubscription = null;
    this.noLeidasSubject.next(0);
  }

  private verificarNoLeidas() {
    try {
      this.http
        .get<{
          total: number;
        }>(`${environment.apiBaseUrl}/notificaciones/no-leidas`, { headers: this.getHeaders() })
        .subscribe({
          next: (res) => {
            const anterior = this.noLeidasSubject.value;
            if (res.total > anterior) {
              this.audio.play().catch(() => {});
            }
            this.noLeidasSubject.next(res.total);
          },
          error: () => {},
        });
    } catch {}
  }

  listarNotificaciones(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiBaseUrl}/notificaciones/`, {
      headers: this.getHeaders(),
    });
  }

  marcarTodasLeidas(): Observable<any> {
    return this.http.patch(
      `${environment.apiBaseUrl}/notificaciones/marcar-leidas`,
      {},
      { headers: this.getHeaders() },
    );
  }

  marcarUnaLeida(id_notificacion: number): Observable<any> {
    return this.http.patch(
      `${environment.apiBaseUrl}/notificaciones/marcar-leidas`,
      { id_notificacion },
      { headers: this.getHeaders() },
    );
  }

  forzarActualizacion() {
    this.verificarNoLeidas();
  }
}
