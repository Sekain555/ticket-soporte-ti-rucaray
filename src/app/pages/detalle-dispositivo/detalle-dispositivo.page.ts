import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { DispositivoService } from 'src/app/services/dispositivo.service';
import { PermissionsService } from 'src/app/services/permissions.service';

@Component({
  selector: 'app-detalle-dispositivo',
  templateUrl: './detalle-dispositivo.page.html',
  styleUrls: ['./detalle-dispositivo.page.scss'],
  standalone: false,
})
export class DetalleDispositivoPage implements OnInit {
  dispositivo: any;
  editando: boolean = false;
  edicion: any = {};

  constructor(
    private route: ActivatedRoute,
    private dispositivoService: DispositivoService,
    private toastCtrl: ToastController,
    public permisos: PermissionsService,
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id_dispositivo');
    if (id) {
      this.cargarDispositivo(Number(id));
    }
  }

  cargarDispositivo(id: number) {
    this.dispositivoService.obtenerDispositivoPorId(id).subscribe({
      next: (res) => (this.dispositivo = res),
      error: () => this.mostrarToast('No se pudo cargar el dispositivo.', 'danger'),
    });
  }

  abrirEdicion() {
    this.edicion = {
      nombre_asignado: this.dispositivo.nombre_asignado || '',
      area: this.dispositivo.area || '',
      tipo_equipo: this.dispositivo.tipo_equipo || '',
      marca: this.dispositivo.marca || '',
      procesador: this.dispositivo.procesador || '',
      ram: this.dispositivo.ram || '',
      disco_duro: this.dispositivo.disco_duro || '',
      monitor: this.dispositivo.monitor,
      antivirus: this.dispositivo.antivirus,
      rj45: this.dispositivo.rj45,
      tipo_lan: this.dispositivo.tipo_lan || '',
      direccion_ip: this.dispositivo.direccion_ip || '',
      mac_wifi: this.dispositivo.mac_wifi || '',
      version_windows: this.dispositivo.version_windows || '',
      tipo_office: this.dispositivo.tipo_office || '',
      nombre_equipo: this.dispositivo.nombre_equipo || '',
      dominio: this.dispositivo.dominio,
      observaciones: this.dispositivo.observaciones || '',
    };
    this.editando = true;
  }

  cancelarEdicion() {
    this.editando = false;
    this.edicion = {};
  }

  guardarEdicion() {
    this.dispositivoService
      .actualizarDispositivo(this.dispositivo.id_dispositivo, this.edicion)
      .subscribe({
        next: () => {
          Object.assign(this.dispositivo, this.edicion);
          this.editando = false;
          this.edicion = {};
          this.mostrarToast('Dispositivo actualizado correctamente.', 'success');
        },
        error: () => this.mostrarToast('Error al actualizar el dispositivo.', 'danger'),
      });
  }

  formatearBooleano(val: any): string {
    if (val === null || val === undefined) return '—';
    return val == 1 ? 'Sí' : 'No';
  }

  private async mostrarToast(mensaje: string, color: string = 'warning') {
    const toast = await this.toastCtrl.create({ message: mensaje, color, duration: 3000 });
    toast.present();
  }
}