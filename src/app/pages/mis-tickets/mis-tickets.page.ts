import { Component, OnInit } from '@angular/core';
import { TicketService } from 'src/app/services/ticket.service';
import { ToastController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';

type EstadoKey = 'todos' | 'abierto' | 'en_progreso' | 'resuelto' | 'cerrado';

type OrdenKey =
  | 'fecha_creacion_desc'
  | 'fecha_creacion_asc'
  | 'prioridad_desc'
  | 'prioridad_asc'
  | 'id_ticket_desc'
  | 'id_ticket_asc';

const ORDER_MAP: Record<OrdenKey, { sort_by: string; order: 'asc' | 'desc' }> =
  {
    fecha_creacion_desc: { sort_by: 'fecha_creacion', order: 'desc' },
    fecha_creacion_asc: { sort_by: 'fecha_creacion', order: 'asc' },
    prioridad_desc: { sort_by: 'prioridad', order: 'desc' },
    prioridad_asc: { sort_by: 'prioridad', order: 'asc' },
    id_ticket_desc: { sort_by: 'id_ticket', order: 'desc' },
    id_ticket_asc: { sort_by: 'id_ticket', order: 'asc' },
  };

@Component({
  selector: 'app-mis-tickets',
  templateUrl: './mis-tickets.page.html',
  styleUrls: ['./mis-tickets.page.scss'],
  standalone: false,
})
export class MisTicketsPage implements OnInit {
  tickets: any[] = [];
  ordenSeleccionado: OrdenKey = 'fecha_creacion_desc';
  filtroEstado: EstadoKey = 'todos';
  pageSize = 10;
  pageIndex = 0;
  total = 0;

  constructor(
    private ticketService: TicketService,
    private toastCtrl: ToastController,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParamMap.subscribe((qp) => {
      const sort_by = qp.get('sort_by') as string | null;
      const order = qp.get('order') as ('asc' | 'desc') | null;
      const estado = (qp.get('estado') as EstadoKey | null) ?? 'todos';
      const limit = Number(qp.get('limit'));
      const offset = Number(qp.get('offset'));

      if (!Number.isNaN(limit) && [10, 25, 50].includes(limit))
        this.pageSize = limit;
      if (!Number.isNaN(offset) && offset >= 0)
        this.pageIndex = Math.floor(offset / this.pageSize);

      const clave = this.inverseOrderKey(sort_by, order);
      if (clave) this.ordenSeleccionado = clave;

      const ALLOWED: EstadoKey[] = [
        'todos',
        'abierto',
        'en_progreso',
        'resuelto',
        'cerrado',
      ];
      this.filtroEstado = ALLOWED.includes(estado) ? estado : 'todos';
      this.refrescarListado();
    });
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
      resuelto: 'tertiary',
      cerrado: 'danger',
    };
    return colores[estado?.toLowerCase()] || 'medium';
  }

  capitalize(text: string): string {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }

  // Semáforo SLA: retorna { color, icono, label } o null si no aplica
  getSemaforoSLA(ticket: any): { color: string; icono: string; label: string } | null {
    // No mostrar en tickets cerrados
    if (!ticket?.fecha_limite_resolucion || ticket?.estado === 'cerrado') return null;

    const ahora = new Date().getTime();
    const fechaCreacion = new Date(ticket.fecha_creacion).getTime();
    const fechaLimite = new Date(ticket.fecha_limite_resolucion).getTime();
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

  cambiarOrden(valor: OrdenKey) {
    this.ordenSeleccionado = valor;
    this.pageIndex = 0;
    this.syncUrlAndReload();
  }

  cambiarFiltroEstado(nuevo: EstadoKey) {
    this.filtroEstado = nuevo || 'todos';
    this.pageIndex = 0;
    this.syncUrlAndReload();
  }

  private refrescarListado() {
    const { sort_by, order } = ORDER_MAP[this.ordenSeleccionado];
    const offset = this.pageIndex * this.pageSize;

    this.ticketService.listarTickets({
        sort_by,
        order,
        estado: this.filtroEstado,
        limit: this.pageSize,
        offset: offset,
      })
      .subscribe({
        next: (resp) => {
          const items =
            Array.isArray(resp?.items) ? resp.items :
            Array.isArray(resp?.tickets) ? resp.tickets :
            Array.isArray(resp) ? resp : [];

          this.tickets = items;

          if (typeof resp?.total === 'number') {
            this.total = resp.total;
          } else if (Array.isArray(resp)) {
            this.total = resp.length;
          } else {
            this.total = 0;
          }
        },
        error: () => this.mostrarToast('No se pudieron cargar los tickets.'),
      });
  }

  private async mostrarToast(message: string, color: string = 'danger') {
    const toast = await this.toastCtrl.create({
      message,
      color,
      duration: 3000,
    });
    await toast.present();
  }

  private inverseOrderKey(
    sort_by?: string | null,
    order?: 'asc' | 'desc' | null
  ): OrdenKey | null {
    if (!sort_by || !order) return null;
    const entry = Object.entries(ORDER_MAP).find(
      ([, v]) => v.sort_by === sort_by && v.order === order
    );
    return entry ? (entry[0] as OrdenKey) : null;
  }

  cambiarPageSize(nuevo: number) {
    const size = Number(nuevo) || 10;
    if (this.pageSize === size) return;

    this.pageSize = size;
    this.pageIndex = 0;
    this.syncUrlAndReload();
  }

  goPrevPage() {
    if (!this.puedeAnterior) return;
    this.pageIndex = this.pageIndex - 1;
    this.syncUrlAndReload();
  }

  goNextPage() {
    if (!this.puedeSiguiente) return;
    this.pageIndex = this.pageIndex + 1;
    this.syncUrlAndReload();
  }

  private syncUrlAndReload() {
    const { sort_by, order } = ORDER_MAP[this.ordenSeleccionado];
    const offset = this.pageIndex * this.pageSize;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        sort_by,
        order,
        estado: this.filtroEstado !== 'todos' ? this.filtroEstado : null,
        limit: this.pageSize,
        offset,
      },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  get itemsStart(): number {
    const start = this.pageIndex * this.pageSize + 1;
    return this.tickets.length ? start : 0;
  }

  get itemsEnd(): number {
    const start = this.itemsStart;
    return start ? start + this.tickets.length - 1 : 0;
  }

  get puedeAnterior(): boolean {
    return this.pageIndex > 0;
  }

  get puedeSiguiente(): boolean {
    if (this.total > 0) {
      const nextOffset = (this.pageIndex + 1) * this.pageSize;
      return nextOffset < this.total;
    }
    return false;
  }
}