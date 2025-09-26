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

      // Si en la URL viene un orden, lo mapeamos a tu clave UI
      const clave = this.inverseOrderKey(sort_by, order);
      if (clave) this.ordenSeleccionado = clave;

      // Validamos el filtro de estado
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

  cambiarOrden(valor: OrdenKey) {
    this.ordenSeleccionado = valor;

    const { sort_by, order } = ORDER_MAP[this.ordenSeleccionado];
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        sort_by,
        order,
        estado: this.filtroEstado !== 'todos' ? this.filtroEstado : null,
      },
      queryParamsHandling: 'merge', // conserva otros params
      replaceUrl: true, // opcional: evita “ensuciar” el historial
    });

    this.refrescarListado();
  }

  cambiarFiltroEstado(nuevo: EstadoKey) {
    this.filtroEstado = nuevo || 'todos';

    const { sort_by, order } = ORDER_MAP[this.ordenSeleccionado];
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        sort_by,
        order,
        estado: this.filtroEstado !== 'todos' ? this.filtroEstado : null, // ← NUEVO
      },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });

    this.refrescarListado();
  }

  private refrescarListado() {
    const { sort_by, order } = ORDER_MAP[this.ordenSeleccionado];

    this.ticketService.listarTickets({ sort_by, order, estado: this.filtroEstado }).subscribe({
      next: (items) => (this.tickets = items ?? []),
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
}
