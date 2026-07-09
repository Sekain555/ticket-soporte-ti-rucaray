import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { Router } from '@angular/router';
import { NotificacionService } from 'src/app/services/notificacion.service';

@Component({
  selector: 'app-notificaciones-popover',
  templateUrl: './notificaciones-popover.component.html',
  styleUrls: ['./notificaciones-popover.component.scss'],
  standalone: false,
})
export class NotificacionesPopoverComponent implements OnInit {
  notificaciones: any[] = [];
  cargando: boolean = true;

  constructor(
    private notificacionService: NotificacionService,
    private popoverCtrl: PopoverController,
    private router: Router,
  ) {}

  ngOnInit() {
    this.cargarNotificaciones();
  }

  cargarNotificaciones() {
    this.cargando = true;
    this.notificacionService.listarNotificaciones().subscribe({
      next: (res) => {
        this.notificaciones = res;
        this.cargando = false;
      },
      error: () => (this.cargando = false),
    });
  }

  marcarTodasLeidas() {
    this.notificacionService.marcarTodasLeidas().subscribe({
      next: () => {
        this.notificaciones = this.notificaciones.map((n) => ({
          ...n,
          leida: 1,
        }));
        this.notificacionService.forzarActualizacion();
      },
    });
  }

  navegarA(notificacion: any) {
    if (!notificacion.leida) {
      this.notificacionService
        .marcarUnaLeida(notificacion.id_notificacion)
        .subscribe(() => {
          this.notificacionService.forzarActualizacion();
        });
    }
    this.popoverCtrl.dismiss();
    if (notificacion.referencia_tipo === 'ticket') {
      this.router.navigate(['/detalle-ticket', notificacion.referencia_id]);
    } else if (notificacion.referencia_tipo === 'mantencion') {
      this.router.navigate([
        '/detalle-agenda-mant',
        notificacion.referencia_id,
      ]);
    }
  }

  cerrar() {
    this.popoverCtrl.dismiss();
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return '';
    const d = new Date(fecha);
    return d.toLocaleDateString('es-CL', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
