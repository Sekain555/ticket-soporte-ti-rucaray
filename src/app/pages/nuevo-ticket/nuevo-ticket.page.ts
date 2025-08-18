import { Component, OnInit } from '@angular/core';
import { TicketService } from 'src/app/services/ticket.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-nuevo-ticket',
  templateUrl: './nuevo-ticket.page.html',
  styleUrls: ['./nuevo-ticket.page.scss'],
  standalone: false
})

export class NuevoTicketPage implements OnInit {
  titulo: string = '';
  descripcion: string = '';
  tipo_problema: string = '';
  prioridad: string = '';
  dispositivo: string = '';

  constructor(
    private ticketService: TicketService,
    private toastCtrl: ToastController
  ) {}

  async crearTicket() {
    try {
      const res = await this.ticketService.crearTicket(
        this.titulo,
        this.descripcion,
        this.tipo_problema,
        this.prioridad,
        this.dispositivo || undefined
      ).toPromise();

      const toast = await this.toastCtrl.create({
        message: 'Ticket creado exitosamente',
        color: 'success',
        duration: 3000
      });
      await toast.present();

      // Limpiar formulario
      this.titulo = '';
      this.descripcion = '';
      this.tipo_problema = '';
      this.prioridad = '';
      this.dispositivo = '';

    } catch (error) {
      const toast = await this.toastCtrl.create({
        message: 'Error al crear ticket',
        color: 'danger',
        duration: 3000
      });
      await toast.present();
    }
  }

  ngOnInit(): void {
    
  }
}
