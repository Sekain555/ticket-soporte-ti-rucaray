import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TicketService } from 'src/app/services/ticket.service';
import { FormsModule } from '@angular/forms';
import { ToastController, AlertController } from '@ionic/angular';

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

  constructor(
    private route: ActivatedRoute,
    private ticketService: TicketService,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
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
                comentario
              )
              .subscribe({
                next: () => {
                  this.ticket.estado = nuevoEstado; // refresca estado en vista
                  this.ticketService
                    .obtenerFeed(this.ticket.id_ticket)
                    .subscribe((feed) => {
                      this.feed = feed; // refresca feed
                    });
                  this.mostrarToast(
                    `Ticket ${
                      nuevoEstado === 'cerrado' ? 'cerrado' : 'reabierto'
                    } con éxito`
                  );
                },
                error: () => {
                  this.mostrarToast('Error al actualizar el estado del ticket');
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
    duracion: number = 2500
  ) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      color: color,
      duration: duracion,
    });
    toast.present();
  }
}
