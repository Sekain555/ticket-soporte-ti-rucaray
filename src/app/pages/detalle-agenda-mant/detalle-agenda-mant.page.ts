import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { MantencionService } from 'src/app/services/mantencion.service';
import { PermissionsService } from 'src/app/services/permissions.service';

@Component({
  selector: 'app-detalle-agenda-mant',
  templateUrl: './detalle-agenda-mant.page.html',
  styleUrls: ['./detalle-agenda-mant.page.scss'],
  standalone: false,
})
export class DetalleAgendaMantPage implements OnInit {
  mantencion: any;

  constructor(
    private route: ActivatedRoute,
    private mantencionService: MantencionService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    public permisos: PermissionsService,
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id_mantencion');
    if (id) {
      this.mantencionService.obtenerMantencionPorId(Number(id)).subscribe({
        next: (res) => (this.mantencion = res),
        error: () =>
          this.mostrarToast('No se pudo cargar la mantención.', 'danger'),
      });
    }
  }

  async cambiarEstado(nuevo_estado: string) {
    const etiquetas: Record<string, string> = {
      confirmado: 'Confirmar',
      reprogramado: 'Reprogramar',
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

  getColorEstado(estado: string): string {
    const colores: Record<string, string> = {
      propuesto: 'warning',
      confirmado: 'success',
      reprogramado: 'tertiary',
      cancelado: 'danger',
    };
    return colores[estado?.toLowerCase()] || 'medium';
  }

  capitalize(text: string): string {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }

  formatearHora(hora: any): string {
    if (!hora) return '';
    const horaStr = String(hora);
    return horaStr.substring(0, 5);
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

  private async mostrarToast(mensaje: string, color: string = 'warning') {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      color,
      duration: 3000,
    });
    toast.present();
  }
}
