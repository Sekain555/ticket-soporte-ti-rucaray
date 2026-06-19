import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TicketService } from 'src/app/services/ticket.service';
import { FormsModule } from '@angular/forms';
import { ToastController, AlertController } from '@ionic/angular';
import { PermissionsService } from 'src/app/services/permissions.service';
declare const html2pdf: any;

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

  descargarPDF() {
    const fecha = new Date().toLocaleDateString('es-CL', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

    const contenido = document.createElement('div');
    contenido.innerHTML = `
    <div style="font-family: Arial, sans-serif; color: #1a1a1a; padding: 32px; max-width: 800px; margin: 0 auto;">

      <!-- Cabecera -->
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #1a56db; padding-bottom: 16px; margin-bottom: 24px;">
        <div>
          <img src="assets/stickers/rucaray-logo.png" style="height: 72px;" alt="Rucaray" />
        </div>
        <div style="text-align: right;">
          <p style="margin: 0; font-size: 11px; color: #6b7280;">SOPORTE TI — RUCARAY</p>
          <h1 style="margin: 4px 0 0; font-size: 18px; color: #1a56db;">Reporte de Ticket #${this.ticket.id_ticket}</h1>
        </div>
      </div>

      <!-- Info del ticket -->
      <div style="background: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
        <h2 style="margin: 0 0 16px; font-size: 14px; text-transform: uppercase; color: #6b7280; letter-spacing: 0.05em;">Información del ticket</h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <tr>
            <td style="padding: 6px 0; color: #6b7280; width: 140px;">Título</td>
            <td style="padding: 6px 0; font-weight: bold;">${this.ticket.titulo}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #6b7280;">Descripción</td>
            <td style="padding: 6px 0;">${this.ticket.descripcion}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #6b7280;">Estado</td>
            <td style="padding: 6px 0;">${this.capitalize(this.ticket.estado)}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #6b7280;">Prioridad</td>
            <td style="padding: 6px 0;">${this.capitalize(this.ticket.prioridad)}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #6b7280;">Categoría</td>
            <td style="padding: 6px 0;">${this.ticket.tipo_problema || 'Pendiente'}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #6b7280;">Dispositivo</td>
            <td style="padding: 6px 0;">${this.ticket.dispositivo || '—'}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #6b7280;">Reportado por</td>
            <td style="padding: 6px 0;">${this.ticket.nombre_usuario} ${this.ticket.apellido_usuario} | ${this.ticket.departamento_usuario} | ${this.ticket.puesto_usuario}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #6b7280;">Fecha de creación</td>
            <td style="padding: 6px 0;">${new Date(this.ticket.fecha_creacion).toLocaleDateString('es-CL', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
          </tr>
          ${
            this.ticket.fecha_limite_resolucion
              ? `
          <tr>
            <td style="padding: 6px 0; color: #6b7280;">Fecha límite SLA</td>
            <td style="padding: 6px 0;">${new Date(this.ticket.fecha_limite_resolucion).toLocaleDateString('es-CL', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
          </tr>`
              : ''
          }
        </table>
      </div>

      <!-- Cronología -->
      <div style="margin-bottom: 24px;">
        <h2 style="margin: 0 0 16px; font-size: 14px; text-transform: uppercase; color: #6b7280; letter-spacing: 0.05em;">Cronología de actividades</h2>
        ${this.feed
          .map(
            (item) => `
          <div style="display: flex; gap: 12px; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #e5e7eb; font-size: 13px;">
            <div style="color: #6b7280; min-width: 130px; font-size: 11px; padding-top: 2px;">
              ${new Date(item.fecha).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </div>
            <div style="flex: 1;">
              <div>${item.detalle || item.tipo}</div>
              <div style="color: #6b7280; font-size: 11px; margin-top: 2px;">${item.nombre_usuario} ${item.apellido_usuario}</div>
            </div>
          </div>
        `,
          )
          .join('')}
      </div>

      <!-- Pie -->
      <div style="border-top: 1px solid #e5e7eb; padding-top: 12px; display: flex; justify-content: space-between; font-size: 11px; color: #9ca3af;">
        <span>Sistema de Tickets Rucaray — STR v1.4.0</span>
        <span>Generado el ${fecha}</span>
      </div>
    </div>
  `;

    const opciones = {
      margin: 0,
      filename: `ticket-${this.ticket.id_ticket}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    };

    html2pdf().set(opciones).from(contenido).save();
  }
}
