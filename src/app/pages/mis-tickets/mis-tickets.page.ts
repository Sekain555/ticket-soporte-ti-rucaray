import { Component, OnInit } from '@angular/core';
import { TicketService } from 'src/app/services/ticket.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-mis-tickets',
  templateUrl: './mis-tickets.page.html',
  styleUrls: ['./mis-tickets.page.scss'],
  standalone: false
})
export class MisTicketsPage implements OnInit {
  tickets: any[] = [];

  constructor(
    private ticketService: TicketService,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (token) {
      this.ticketService.listarTickets().subscribe({
        next: (data) => {
          this.tickets = data;
        },
        error: (err) => {
          console.error('Error al cargar los tickets:', err);
          this.toastCtrl.create({
            message: 'Error al cargar los tickets',
            color: 'danger',
            duration: 3000
          }).then(toast => toast.present());
        }
      });
    }
  }
}
