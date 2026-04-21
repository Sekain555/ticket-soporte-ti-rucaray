import { Component, OnInit } from '@angular/core';
import { MantencionService } from 'src/app/services/mantencion.service';
import { ToastController } from '@ionic/angular';

type Periodo = 'hoy' | 'esta-semana' | 'este-mes';

@Component({
  selector: 'app-agenda-mantenimiento',
  templateUrl: './agenda-mantenimiento.page.html',
  styleUrls: ['./agenda-mantenimiento.page.scss'],
  standalone: false,
})
export class AgendaMantenimientoPage implements OnInit {
  mantenciones: any[] = [];
  filtroEstado: string = 'todos';
  filtroPeriodo: Periodo = 'esta-semana';
  total: number = 0;

  // Fecha de referencia para navegación (inicio del período actual)
  private fechaReferencia: Date = new Date();

  constructor(
    private mantencionService: MantencionService,
    private toastCtrl: ToastController,
  ) {}

  ngOnInit() {
    this.resetFechaReferencia();
    this.cargarMantenciones();
  }

  ionViewWillEnter() {
    this.cargarMantenciones();
  }

  cargarMantenciones() {
    const opts: any = { limit: 100, offset: 0 };
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

  cambiarFiltroPeriodo(nuevo: Periodo) {
    this.filtroPeriodo = nuevo;
    this.resetFechaReferencia();
  }

  private resetFechaReferencia() {
    this.fechaReferencia = new Date();
    this.fechaReferencia.setHours(0, 0, 0, 0);
  }

  // Navegar al período anterior
  periodoAnterior() {
    const d = new Date(this.fechaReferencia);
    if (this.filtroPeriodo === 'hoy') d.setDate(d.getDate() - 1);
    else if (this.filtroPeriodo === 'esta-semana') d.setDate(d.getDate() - 7);
    else if (this.filtroPeriodo === 'este-mes') d.setMonth(d.getMonth() - 1);
    this.fechaReferencia = d;
  }

  // Navegar al período siguiente
  periodoSiguiente() {
    const d = new Date(this.fechaReferencia);
    if (this.filtroPeriodo === 'hoy') d.setDate(d.getDate() + 1);
    else if (this.filtroPeriodo === 'esta-semana') d.setDate(d.getDate() + 7);
    else if (this.filtroPeriodo === 'este-mes') d.setMonth(d.getMonth() + 1);
    this.fechaReferencia = d;
  }

  // Rango de fechas del período actual
  get rangoPeriodo(): { inicio: Date; fin: Date } {
    const ref = new Date(this.fechaReferencia);

    if (this.filtroPeriodo === 'hoy') {
      const inicio = new Date(ref);
      const fin = new Date(ref);
      fin.setHours(23, 59, 59);
      return { inicio, fin };
    }

    if (this.filtroPeriodo === 'esta-semana') {
      const inicio = new Date(ref);
      const diaSemana = inicio.getDay(); // 0=dom, 1=lun...
      const diff = diaSemana === 0 ? -6 : 1 - diaSemana; // ajustar a lunes
      inicio.setDate(inicio.getDate() + diff);
      const fin = new Date(inicio);
      fin.setDate(inicio.getDate() + 6);
      fin.setHours(23, 59, 59);
      return { inicio, fin };
    }

    // este-mes
    const inicio = new Date(ref.getFullYear(), ref.getMonth(), 1);
    const fin = new Date(ref.getFullYear(), ref.getMonth() + 1, 0);
    fin.setHours(23, 59, 59);
    return { inicio, fin };
  }

  // Etiqueta del período actual para mostrar en UI
  get etiquetaPeriodo(): string {
    const { inicio, fin } = this.rangoPeriodo;
    const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };

    if (this.filtroPeriodo === 'hoy') {
      return inicio.toLocaleDateString('es-CL', opts);
    }
    if (this.filtroPeriodo === 'esta-semana') {
      return `${inicio.toLocaleDateString('es-CL', { day: 'numeric', month: 'short' })} — ${fin.toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' })}`;
    }
    return inicio.toLocaleDateString('es-CL', { month: 'long', year: 'numeric' });
  }

  // Filtra mantenciones por el período activo
  get mantencionesFiltradas(): any[] {
    const { inicio, fin } = this.rangoPeriodo;
    return this.mantenciones.filter((m) => {
      const fecha = new Date(m.fecha_propuesta + 'T00:00:00');
      return fecha >= inicio && fecha <= fin;
    });
  }

  // Agrupa mantenciones filtradas por fecha_propuesta
  get mantencionesPorFecha(): { fecha: string; items: any[] }[] {
    const grupos: Record<string, any[]> = {};
    for (const m of this.mantencionesFiltradas) {
      const fecha = m.fecha_propuesta?.substring(0, 10) || 'Sin fecha';
      if (!grupos[fecha]) grupos[fecha] = [];
      grupos[fecha].push(m);
    }
    return Object.entries(grupos)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([fecha, items]) => ({ fecha, items }));
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
    return String(hora).substring(0, 5);
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