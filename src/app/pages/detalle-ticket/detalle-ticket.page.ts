import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TicketService } from 'src/app/services/ticket.service';
import { FormsModule } from '@angular/forms';

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
    private ticketService: TicketService
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
    if (!this.nuevoComentario.trim()) return; // evita comentarios vacíos

    const id_ticket = this.ticket.id_ticket;

    this.ticketService
      .agregarComentario(id_ticket, this.nuevoComentario)
      .subscribe({
        next: (res) => {
          // refrescar feed después de agregar comentario
          this.ticketService.obtenerFeed(id_ticket).subscribe((feedRes) => {
            this.feed = feedRes;
            this.nuevoComentario = ''; // limpiar textarea
          });
        },
        error: (err) => {
          console.error('Error al agregar comentario', err);
        },
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
      cerrado: 'danger',
    };
    return colores[estado?.toLowerCase()] || 'medium';
  }

  capitalize(text: string): string {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }

  getIconoActividad(tipo: string): string {
    const iconos: Record<string, string> = {
      creacion_ticket: 'ticket',
      asignacion: 'people',
      cambio_estado: 'swap-horizontal',
      comentario: 'person-circle',
    };
    return iconos[tipo?.toLowerCase()] || 'alert-circle';
  }

  esComentario(feedItem: any): boolean {
    return feedItem.tipo.toLowerCase() === 'comentario';
  }
}
