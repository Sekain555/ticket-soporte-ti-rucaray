import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { MantencionService } from 'src/app/services/mantencion.service';

@Component({
  selector: 'app-programar-mantenimiento',
  templateUrl: './programar-mantenimiento.page.html',
  styleUrls: ['./programar-mantenimiento.page.scss'],
  standalone: false,
})
export class ProgramarMantenimientoPage {
  titulo: string = '';
  descripcion: string = '';
  fechaPropuesta: string = '';
  horaInicio: string = '';
  horaFin: string = '';

  esMobil: boolean = false;

  constructor(
    private mantencionService: MantencionService,
    private toastCtrl: ToastController,
    private router: Router,
    private platform: Platform,
  ) {
    this.esMobil = this.platform.is('mobile') || this.platform.is('capacitor');
  }

  programarMantencion() {
    if (!this.titulo.trim()) {
      this.mostrarToast('El título es obligatorio.', 'warning');
      return;
    }
    if (!this.fechaPropuesta) {
      this.mostrarToast('Debes seleccionar una fecha.', 'warning');
      return;
    }
    if (!this.horaInicio || !this.horaFin) {
      this.mostrarToast('Debes indicar hora de inicio y término.', 'warning');
      return;
    }

    const horaInicioFmt = this.formatearHora(this.horaInicio);
    const horaFinFmt = this.formatearHora(this.horaFin);
    const fechaFmt = this.formatearFecha(this.fechaPropuesta);

    this.mantencionService.crearMantencion(
      this.titulo.trim(),
      fechaFmt,
      horaInicioFmt,
      horaFinFmt,
      this.descripcion.trim() || undefined,
    ).subscribe({
      next: () => {
        this.mostrarToast('Mantención agendada exitosamente.', 'success');
        this.router.navigate(['/agenda-mantenimiento']);
      },
      error: (err) => {
        // Error 409 = conflicto de horario con mensaje descriptivo del backend
        if (err?.status === 409) {
          this.mostrarToast(err.error?.detail || 'Conflicto de horario.', 'danger', 5000);
        } else {
          this.mostrarToast('Error al agendar la mantención.', 'danger');
        }
      },
    });
  }

  private formatearHora(valor: string): string {
    if (!valor) return '';
    if (valor.includes('T')) {
      const date = new Date(valor);
      return date.toTimeString().substring(0, 5);
    }
    return valor.substring(0, 5);
  }

  private formatearFecha(valor: string): string {
    if (!valor) return '';
    if (valor.includes('T')) {
      return valor.substring(0, 10);
    }
    return valor;
  }

  private async mostrarToast(mensaje: string, color: string = 'warning', duracion: number = 3000) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      color,
      duration: duracion,
    });
    toast.present();
  }
}