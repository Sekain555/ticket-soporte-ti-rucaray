import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { MantencionService } from 'src/app/services/mantencion.service';
import { ToastController } from '@ionic/angular';
import { CalendarEvent, CalendarView } from 'angular-calendar';

type Periodo = 'hoy' | 'esta-semana' | 'este-mes';

type Periodo = 'hoy' | 'esta-semana' | 'este-mes';

@Component({
  selector: 'app-agenda-mantenimiento',
  templateUrl: './agenda-mantenimiento.page.html',
  styleUrls: ['./agenda-mantenimiento.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class AgendaMantenimientoPage implements OnInit {
  // Vista activa: lista o calendario
  vistaActiva: 'lista' | 'calendario' = 'lista';
  CalendarView = CalendarView;
  calendarView: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();

  // Datos
  mantenciones: any[] = [];
  calendarEvents: CalendarEvent[] = [];
  filtroEstado: string = 'todos';
  filtroPeriodo: Periodo = 'esta-semana';
  total: number = 0;

  private fechaReferencia: Date = new Date();

  // Colores por estado para el calendario
  private readonly COLORES: Record<string, { primary: string; secondary: string }> = {
    propuesto:    { primary: '#f0a500', secondary: '#fde8b0' },
    confirmado:   { primary: '#2dd36f', secondary: '#c8f5dc' },
    reprogramado: { primary: '#5260ff', secondary: '#d6d9ff' },
    cancelado:    { primary: '#eb445a', secondary: '#fdd8dd' },
  };

  constructor(
    private mantencionService: MantencionService,
    private toastCtrl: ToastController,
    private cdr: ChangeDetectorRef,
    private router: Router,
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
        this.calendarEvents = this.buildCalendarEvents(this.mantenciones);
        this.cdr.markForCheck();
      },
      error: () =>
        this.mostrarToast('No se pudieron cargar las mantenciones.', 'danger'),
    });
  }

  // Convierte mantenciones a eventos de angular-calendar
  private buildCalendarEvents(mantenciones: any[]): CalendarEvent[] {
    return mantenciones.map((m) => {
      const fecha = m.fecha_propuesta?.substring(0, 10);
      const inicio = new Date(`${fecha}T${m.hora_inicio || '00:00'}:00`);
      const fin = new Date(`${fecha}T${m.hora_fin || '00:00'}:00`);
      const color = this.COLORES[m.estado] || { primary: '#92949c', secondary: '#e0e0e0' };

      return {
        id: m.id_mantencion,
        title: m.titulo,
        start: inicio,
        end: fin,
        color,
        meta: m,
      };
    });
  }

  // Navegar a detalle al hacer click en un evento del calendario
  onEventClick(event: CalendarEvent) {
    this.router.navigate(['/detalle-agenda-mant', event.id]);
  }

  // Switch entre vistas
  cambiarVista(vista: 'lista' | 'calendario') {
    this.vistaActiva = vista;
    if (vista === 'calendario') {
      this.viewDate = new Date();
    }
  }

  // Cambiar vista del calendario (mes/semana)
  setCalendarView(view: CalendarView) {
    this.calendarView = view;
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

  periodoAnterior() {
    const d = new Date(this.fechaReferencia);
    if (this.filtroPeriodo === 'hoy') d.setDate(d.getDate() - 1);
    else if (this.filtroPeriodo === 'esta-semana') d.setDate(d.getDate() - 7);
    else if (this.filtroPeriodo === 'este-mes') d.setMonth(d.getMonth() - 1);
    this.fechaReferencia = d;
  }

  periodoSiguiente() {
    const d = new Date(this.fechaReferencia);
    if (this.filtroPeriodo === 'hoy') d.setDate(d.getDate() + 1);
    else if (this.filtroPeriodo === 'esta-semana') d.setDate(d.getDate() + 7);
    else if (this.filtroPeriodo === 'este-mes') d.setMonth(d.getMonth() + 1);
    this.fechaReferencia = d;
  }

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
      const diaSemana = inicio.getDay();
      const diff = diaSemana === 0 ? -6 : 1 - diaSemana;
      inicio.setDate(inicio.getDate() + diff);
      const fin = new Date(inicio);
      fin.setDate(inicio.getDate() + 6);
      fin.setHours(23, 59, 59);
      return { inicio, fin };
    }

    const inicio = new Date(ref.getFullYear(), ref.getMonth(), 1);
    const fin = new Date(ref.getFullYear(), ref.getMonth() + 1, 0);
    fin.setHours(23, 59, 59);
    return { inicio, fin };
  }

  get etiquetaPeriodo(): string {
    const { inicio, fin } = this.rangoPeriodo;
    if (this.filtroPeriodo === 'hoy') {
      return inicio.toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' });
    }
    if (this.filtroPeriodo === 'esta-semana') {
      return `${inicio.toLocaleDateString('es-CL', { day: 'numeric', month: 'short' })} — ${fin.toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' })}`;
    }
    return inicio.toLocaleDateString('es-CL', { month: 'long', year: 'numeric' });
  }

  get mantencionesFiltradas(): any[] {
    const { inicio, fin } = this.rangoPeriodo;
    return this.mantenciones.filter((m) => {
      const fecha = new Date(m.fecha_propuesta + 'T00:00:00');
      return fecha >= inicio && fecha <= fin;
    });
  }

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