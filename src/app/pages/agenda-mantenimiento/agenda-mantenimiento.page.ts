import { Component, OnInit } from '@angular/core';
import { MantencionService } from 'src/app/services/mantencion.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-agenda-mantenimiento',
  templateUrl: './agenda-mantenimiento.page.html',
  styleUrls: ['./agenda-mantenimiento.page.scss'],
  standalone: false,
})
export class AgendaMantenimientoPage implements OnInit {
  mantenciones: any[] = [];
  filtroEstado: string = 'todos';
  total: number = 0;

  constructor(
    private mantencionService: MantencionService,
    private toastCtrl: ToastController,
  ) {}

  ngOnInit() {
    this.cargarMantenciones();
  }

  ionViewWillEnter() {
    this.cargarMantenciones();
  }

  cargarMantenciones() {
    const opts: any = { limit: 50, offset: 0 };
    if (this.filtroEstado !== 'todos') opts.estado = this.filtroEstado;

    this.mantencionService.listarMantenciones(opts).subscribe({
      next: (resp) => {
        this.mantenciones = resp?.mantenciones || [];
        this.total = resp?.total || 0;
      },
      error: () =>
        this.mostrarToast('No se pudieron cargar las mantenciones.', 'danger'),
    });
  }

  cambiarFiltroEstado(nuevo: string) {
    this.filtroEstado = nuevo;
    this.cargarMantenciones();
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

  formatearHora(hora: any): string {
    if (!hora) return '';
    const horaStr = String(hora);
    return horaStr.substring(0, 5);
  }

  // Agrupa mantenciones por fecha_propuesta
  get mantencionesPorFecha(): { fecha: string; items: any[] }[] {
    const grupos: Record<string, any[]> = {};
    for (const m of this.mantenciones) {
      const fecha = m.fecha_propuesta?.substring(0, 10) || 'Sin fecha';
      if (!grupos[fecha]) grupos[fecha] = [];
      grupos[fecha].push(m);
    }
    return Object.entries(grupos)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([fecha, items]) => ({ fecha, items }));
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
