import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TicketService } from 'src/app/services/ticket.service';
import { FormsModule } from '@angular/forms';
import { ToastController, AlertController } from '@ionic/angular';
import { PermissionsService } from 'src/app/services/permissions.service';

@Component({
  selector: 'app-detalle-ticket',
  templateUrl: './detalle-ticket.page.html',
  styleUrls: ['./detalle-ticket.page.scss'],
  standalone: false,
})
export class DetalleTicketPage implements OnInit {
  ticket: any;
  feed: any[] = [];
  nuevoComentario: string = '';
  modoEdicion: boolean = false;
  edicion: any = {};

  constructor(
    private route: ActivatedRoute,
    private ticketService: TicketService,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    public permisos: PermissionsService,
  ) {}

  ngOnInit() {
    const id_ticket = this.route.snapshot.paramMap.get('id_ticket');
    if (id_ticket) {
      this.ticketService.obtenerTicketPorId(id_ticket).subscribe((res) => {
        this.ticket = res;
        this.ticketService.obtenerFeed(id_ticket).subscribe((feedRes) => {
          this.feed = feedRes;
        });
      });
    }
  }

  agregarComentario() {
    if (!this.nuevoComentario.trim()) return;

    const id_ticket = this.ticket.id_ticket;

    this.ticketService
      .agregarComentario(id_ticket, this.nuevoComentario)
      .subscribe({
        next: (res) => {
          this.ticketService.obtenerFeed(id_ticket).subscribe((feedRes) => {
            this.feed = feedRes;
            this.nuevoComentario = '';
          });
        },
        error: (err) => {
          console.error('Error al agregar comentario', err);
        },
      });
  }

  async toggleEstadoTicket() {
    if (!this.ticket) return;

    const nuevoEstado =
      this.ticket.estado === 'cerrado' ? 'abierto' : 'cerrado';
    const titulo =
      nuevoEstado === 'cerrado' ? 'Confirmar cierre' : 'Reabrir Ticket';
    const mensaje =
      nuevoEstado === 'cerrado'
        ? '¿Deseas cerrar este ticket? Agrega un comentario breve.'
        : '¿Deseas reabrir este ticket? Agrega un comentario breve.';

    const alert = await this.alertCtrl.create({
      header: titulo,
      message: mensaje,
      inputs: [
        {
          name: 'comentario',
          type: 'textarea',
          placeholder: 'Comentario obligatorio',
        },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: nuevoEstado === 'cerrado' ? 'Cerrar' : 'Reabrir',
          handler: (data) => {
            const comentario = data.comentario?.trim();
            if (!comentario) {
              this.mostrarToast('El comentario es obligatorio.');
              return false;
            }

            this.ticketService
              .cambiarEstadoTicket(
                this.ticket.id_ticket,
                nuevoEstado,
                comentario,
              )
              .subscribe({
                next: (res: any) => {
                  this.ticket.estado = nuevoEstado;
                  this.ticketService
                    .obtenerFeed(this.ticket.id_ticket)
                    .subscribe((feed) => {
                      this.feed = feed;
                    });

                  if (nuevoEstado === 'cerrado') {
                    const sla = res?.resultado_sla;
                    if (sla === 'dentro_plazo') {
                      this.mostrarToast(
                        'Ticket cerrado · Resuelto dentro del plazo',
                        'success',
                        4000,
                      );
                    } else if (sla === 'fuera_plazo') {
                      this.mostrarToast(
                        'Ticket cerrado · Resuelto fuera del plazo',
                        'danger',
                        4000,
                      );
                    } else {
                      this.mostrarToast(
                        'Ticket cerrado · Sin SLA asignado',
                        'warning',
                        4000,
                      );
                    }
                  } else {
                    this.mostrarToast('Ticket reabierto con éxito', 'success');
                  }
                },
                error: () => {
                  this.mostrarToast(
                    'Error al actualizar el estado del ticket',
                    'danger',
                  );
                },
              });

            return true;
          },
        },
      ],
    });
    await alert.present();
  }

  getColorPrioridad(prioridad: string): string {
    const colores: Record<string, string> = {
      alta: 'danger',
      media: 'warning',
      baja: 'success',
    };
    return colores[prioridad?.toLowerCase()] || 'medium';
  }

  getColorEstado(estado: string): string {
    const colores: Record<string, string> = {
      abierto: 'success',
      'en progreso': 'warning',
      cerrado: 'danger',
    };
    return colores[estado?.toLowerCase()] || 'medium';
  }

  capitalize(text: string): string {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }

  getIconoActividad(tipo: string, detalle?: string): string {
    const iconos: Record<string, string> = {
      creacion_ticket: 'ticket',
      asignacion: 'people',
    };
    if (tipo === 'cambio_estado') {
      if (detalle?.toLowerCase().includes('cerrado')) return 'lock-closed';
      if (detalle?.toLowerCase().includes('abierto')) return 'lock-open';
      return 'swap-vertical';
    }
    return iconos[tipo?.toLowerCase()] || 'alert-circle';
  }

  esComentario(feedItem: any): boolean {
    return feedItem.tipo.toLowerCase() === 'comentario';
  }

  async mostrarToast(
    mensaje: string,
    color: string = 'warning',
    duracion: number = 2500,
  ) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      color: color,
      duration: duracion,
    });
    toast.present();
  }

  formatearTiempoObjetivo(
    minimo: number | null,
    maximo: number | null,
  ): string {
    if (!maximo) return 'Sin SLA';

    const formatear = (horas: number): string => {
      const dias = Math.floor(horas / 24);
      const horasRestantes = horas % 24;
      if (dias === 0) return `${horas} hora${horas !== 1 ? 's' : ''}`;
      if (horasRestantes === 0) return `${dias} día${dias !== 1 ? 's' : ''}`;
      return `${dias} día${dias !== 1 ? 's' : ''} ${horasRestantes} hora${horasRestantes !== 1 ? 's' : ''}`;
    };

    if (!minimo || minimo === maximo) return formatear(maximo);
    return `${formatear(minimo)} a ${formatear(maximo)}`;
  }

  // Semáforo SLA: retorna { color, icono, label } o null si no aplica
  getSemaforoSLA(): { color: string; icono: string; label: string } | null {
    if (
      !this.ticket?.fecha_limite_resolucion ||
      this.ticket?.estado === 'cerrado'
    )
      return null;

    const ahora = new Date().getTime();
    const fechaCreacion = new Date(this.ticket.fecha_creacion).getTime();
    const fechaLimite = new Date(this.ticket.fecha_limite_resolucion).getTime();
    const tiempoTotal = fechaLimite - fechaCreacion;
    const tiempoTranscurrido = ahora - fechaCreacion;

    if (tiempoTranscurrido >= tiempoTotal) {
      return { color: 'danger', icono: 'alert-circle', label: 'Vencido' };
    }

    const porcentajeUsado = tiempoTranscurrido / tiempoTotal;
    if (porcentajeUsado > 0.5) {
      return { color: 'warning', icono: 'time', label: 'Próximo a vencer' };
    }

    return { color: 'success', icono: 'checkmark-circle', label: 'En plazo' };
  }

  abrirEdicion() {
    this.edicion = {
      titulo: this.ticket.titulo || '',
      descripcion: this.ticket.descripcion || '',
      prioridad: this.ticket.prioridad || '',
      dispositivo: this.ticket.dispositivo || '',
      tipo_problema: this.ticket.tipo_problema || '',
    };
    this.modoEdicion = true;
  }

  cancelarEdicion() {
    this.modoEdicion = false;
    this.edicion = {};
  }

  guardarEdicion() {
    const id_ticket = this.ticket.id_ticket;
    this.ticketService.editarTicket(id_ticket, this.edicion).subscribe({
      next: (res) => {
        this.ticket = res;
        this.modoEdicion = false;
        this.edicion = {};
        this.ticketService.obtenerFeed(id_ticket).subscribe((feedRes) => {
          this.feed = feedRes;
        });
        this.mostrarToast('Ticket actualizado correctamente.', 'success');
      },
      error: () =>
        this.mostrarToast('Error al actualizar el ticket.', 'danger'),
    });
  }

  puedeEditar(): boolean {
    if (this.permisos.canEditTickets()) return true;
    return this.ticket?.estado === 'abierto';
  }
}
