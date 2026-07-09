import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-mencionar-usuario-modal',
  templateUrl: './mencionar-usuario-modal.component.html',
  styleUrls: ['./mencionar-usuario-modal.component.scss'],
  standalone: false,
})
export class MencionarUsuarioModalComponent implements OnInit {
  usuarios: any[] = [];
  usuariosFiltrados: any[] = [];
  busqueda: string = '';

  constructor(
    private modalCtrl: ModalController,
    private usuarioService: UsuarioService,
  ) {}

  ngOnInit() {
    this.usuarioService.listarTodos().subscribe({
      next: (res) => {
        this.usuarios = res;
        this.usuariosFiltrados = res;
      },
    });
  }

  filtrar(evento: any) {
    const termino = evento.detail.value?.toLowerCase() || '';
    this.usuariosFiltrados = this.usuarios.filter((u) =>
      `${u.nombre} ${u.apellido}`.toLowerCase().includes(termino),
    );
  }

  seleccionar(usuario: any) {
    this.modalCtrl.dismiss({ usuario });
  }

  cerrar() {
    this.modalCtrl.dismiss();
  }
}
