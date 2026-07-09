import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  AlertController,
  ToastController,
  ModalController,
} from '@ionic/angular';
import { MantencionService } from 'src/app/services/mantencion.service';
import { PermissionsService } from 'src/app/services/permissions.service';
import { Platform } from '@ionic/angular';
import { MencionarUsuarioModalComponent } from 'src/app/components/mencionar-usuario-modal/mencionar-usuario-modal.component';

@Component({
  selector: 'app-detalle-agenda-mant',
  templateUrl: './detalle-agenda-mant.page.html',
  styleUrls: ['./detalle-agenda-mant.page.scss'],
  standalone: false,
})
export class DetalleAgendaMantPage implements OnInit {
  mantencion: any;
  feed: any[] = [];
  nuevoComentario: string = '';

  // Reprogramación
  mostrarFormReprogramar: boolean = false;
  nuevaFecha: string = '';
  nuevaHoraInicio: string = '';
  nuevaHoraFin: string = '';
  notasReprogramacion: string = '';
  esMobil: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private mantencionService: MantencionService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    public permisos: PermissionsService,
    private platform: Platform,
    private modalCtrl: ModalController,
  ) {
    this.esMobil = this.platform.is('mobile') || this.platform.is('capacitor');
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id_mantencion');
    if (id) {
      this.cargarMantencion(Number(id));
    }
  }

  cargarMantencion(id: number) {
    this.mantencionService.obtenerMantencionPorId(id).subscribe({
      next: (res) => {
        this.mantencion = res;
        this.cargarFeed(id);
      },
      error: () =>
        this.mostrarToast('No se pudo cargar la mantención.', 'danger'),
    });
  }

  cargarFeed(id: number) {
    this.mantencionService.obtenerFeedMantencion(id).subscribe({
      next: (res) => (this.feed = res || []),
      error: () => (this.feed = []),
    });
  }

  agregarComentario() {
    if (!this.nuevoComentario.trim()) return;
    this.mantencionService
      .agregarComentarioMantencion(
        this.mantencion.id_mantencion,
        this.nuevoComentario.trim(),
      )
      .subscribe({
        next: () => {
          this.nuevoComentario = '';
          this.cargarFeed(this.mantencion.id_mantencion);
        },
        error: () =>
          this.mostrarToast('Error al agregar comentario.', 'danger'),
      });
  }

  // Abre el formulario de reprogramación prellenado con los valores actuales
  abrirFormReprogramar() {
    this.nuevaFecha = this.mantencion.fecha_propuesta?.substring(0, 10) || '';
    this.nuevaHoraInicio = this.mantencion.hora_inicio?.substring(0, 5) || '';
    this.nuevaHoraFin = this.mantencion.hora_fin?.substring(0, 5) || '';
    this.notasReprogramacion = '';
    this.mostrarFormReprogramar = true;
  }

  cancelarReprogramacion() {
    this.mostrarFormReprogramar = false;
  }

  confirmarReprogramacion() {
    if (!this.nuevaFecha || !this.nuevaHoraInicio || !this.nuevaHoraFin) {
      this.mostrarToast(
        'Debes completar fecha, hora inicio y hora término.',
        'warning',
      );
      return;
    }

    const fechaFmt = this.formatearFechaInput(this.nuevaFecha);
    const horaInicioFmt = this.formatearHoraInput(this.nuevaHoraInicio);
    const horaFinFmt = this.formatearHoraInput(this.nuevaHoraFin);

    this.mantencionService
      .reprogramarMantencion(
        this.mantencion.id_mantencion,
        fechaFmt,
        horaInicioFmt,
        horaFinFmt,
        this.notasReprogramacion.trim() || undefined,
      )
      .subscribe({
        next: () => {
          this.mantencion.fecha_propuesta = fechaFmt;
          this.mantencion.hora_inicio = horaInicioFmt;
          this.mantencion.hora_fin = horaFinFmt;
          this.mantencion.estado = 'reprogramado';
          this.mostrarFormReprogramar = false;
          this.cargarFeed(this.mantencion.id_mantencion);
          this.mostrarToast(
            'Mantención reprogramada correctamente.',
            'success',
          );
        },
        error: (err) => {
          if (err?.status === 409) {
            this.mostrarToast(
              err.error?.detail || 'Conflicto de horario.',
              'danger',
              5000,
            );
          } else {
            this.mostrarToast('Error al reprogramar la mantención.', 'danger');
          }
        },
      });
  }

  async cambiarEstado(nuevo_estado: string) {
    const etiquetas: Record<string, string> = {
      confirmado: 'Confirmar',
      cancelado: 'Cancelar',
    };

    const alert = await this.alertCtrl.create({
      header: `${etiquetas[nuevo_estado] || 'Actualizar'} mantención`,
      message: '¿Deseas agregar una nota? (opcional)',
      inputs: [
        {
          name: 'notas',
          type: 'textarea',
          placeholder: 'Notas adicionales...',
        },
      ],
      buttons: [
        { text: 'Cancelar acción', role: 'cancel' },
        {
          text: etiquetas[nuevo_estado] || 'Confirmar',
          handler: (data) => {
            this.mantencionService
              .actualizarEstadoMantencion(
                this.mantencion.id_mantencion,
                nuevo_estado,
                data.notas?.trim() || undefined,
              )
              .subscribe({
                next: () => {
                  this.mantencion.estado = nuevo_estado;
                  if (data.notas?.trim()) {
                    this.mantencion.notas_soporte = data.notas.trim();
                  }
                  this.cargarFeed(this.mantencion.id_mantencion);
                  this.mostrarToast(
                    `Mantención ${nuevo_estado} correctamente.`,
                    'success',
                  );
                },
                error: () =>
                  this.mostrarToast('Error al actualizar el estado.', 'danger'),
              });
          },
        },
      ],
    });
    await alert.present();
  }

  // Helpers para normalizar valores de inputs de fecha y hora
  private formatearFechaInput(valor: string): string {
    if (!valor) return '';
    return valor.includes('T') ? valor.substring(0, 10) : valor;
  }

  private formatearHoraInput(valor: string): string {
    if (!valor) return '';
    if (valor.includes('T')) {
      const date = new Date(valor);
      return date.toTimeString().substring(0, 5);
    }
    return valor.substring(0, 5);
  }

  getColorEstado(estado: string): string {
    const colores: Record<string, string> = {
      propuesto: 'warning',
      confirmado: 'success',
      reprogramado: 'tertiary',
      cancelado: 'danger',
    };
    return colores[estado?.toLowerCase()] || 'medium';
  }

  getIconoFeed(tipo: string): string {
    const iconos: Record<string, string> = {
      creacion: 'calendar',
      cambio_estado: 'swap-vertical',
      comentario: 'chatbubble',
      reprogramacion: 'calendar',
    };
    return iconos[tipo?.toLowerCase()] || 'ellipse';
  }

  esComentario(item: any): boolean {
    return item.tipo?.toLowerCase() === 'comentario';
  }

  capitalize(text: string): string {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }

  formatearHora(hora: any): string {
    if (!hora) return '';
    return String(hora).substring(0, 5);
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return '';
    const date = new Date(fecha + 'T00:00:00');
    return date.toLocaleDateString('es-CL', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  private async mostrarToast(
    mensaje: string,
    color: string = 'warning',
    duracion: number = 3000,
  ) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      color,
      duration: duracion,
    });
    toast.present();
  }

  async abrirModalMencion() {
    const modal = await this.modalCtrl.create({
      component: MencionarUsuarioModalComponent,
      breakpoints: [0, 0.5, 0.75],
      initialBreakpoint: 0.75,
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data?.usuario) {
      const mencion = `@${data.usuario.nombre}${data.usuario.apellido} `;
      this.nuevoComentario = (this.nuevoComentario || '') + mencion;
    }
  }
}
