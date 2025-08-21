import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TicketService } from 'src/app/services/ticket.service';

@Component({
  selector: 'app-detalle-ticket',
  templateUrl: './detalle-ticket.page.html',
  styleUrls: ['./detalle-ticket.page.scss'],
  standalone: false,
})

export class DetalleTicketPage implements OnInit {
  ticket: any;

  constructor(
    private route: ActivatedRoute,
    private ticketService: TicketService
  ) {}

  ngOnInit() {
    const id_ticket = this.route.snapshot.paramMap.get('id_ticket');
    if (id_ticket) {
      this.ticketService.obtenerTicketPorId(id_ticket).subscribe((res) => {
        this.ticket = res;
      });
    }
  }
}
