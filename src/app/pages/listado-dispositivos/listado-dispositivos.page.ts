import { Component, OnInit } from '@angular/core';
import { DispositivoService } from 'src/app/services/dispositivo.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-listado-dispositivos',
  templateUrl: './listado-dispositivos.page.html',
  styleUrls: ['./listado-dispositivos.page.scss'],
  standalone: false,
})
export class ListadoDispositivosPage implements OnInit {
  dispositivos: any[] = [];
  total: number = 0;
  filtroTipo: string = 'todos';
  busquedaArea: string = '';
  ordenamiento: string = 'nombre_asc';

  constructor(
    private dispositivoService: DispositivoService,
    private toastCtrl: ToastController,
  ) {}

  ngOnInit() {
    this.cargarDispositivos();
  }

  ionViewWillEnter() {
    this.cargarDispositivos();
  }

  cargarDispositivos() {
    const opts: any = { limit: 100, offset: 0 };
    if (this.filtroTipo !== 'todos') opts.tipo = this.filtroTipo;
    if (this.busquedaArea.trim()) opts.area = this.busquedaArea.trim();

    this.dispositivoService.listarDispositivos(opts).subscribe({
      next: (resp) => {
        this.dispositivos = resp?.dispositivos || [];
        this.total = resp?.total || 0;
      },
      error: () =>
        this.mostrarToast('No se pudieron cargar los dispositivos.', 'danger'),
    });
  }

  cambiarFiltroTipo(tipo: string) {
    this.filtroTipo = tipo;
    this.cargarDispositivos();
  }

  buscar() {
    this.cargarDispositivos();
  }

  limpiarBusqueda() {
    this.busquedaArea = '';
    this.cargarDispositivos();
  }

  private async mostrarToast(mensaje: string, color: string = 'warning') {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      color,
      duration: 3000,
    });
    toast.present();
  }

  get dispositivosOrdenados(): any[] {
    return [...this.dispositivos].sort((a, b) => {
      switch (this.ordenamiento) {
        case 'nombre_asc':
          return (a.nombre_asignado || '').localeCompare(
            b.nombre_asignado || '',
          );
        case 'nombre_desc':
          return (b.nombre_asignado || '').localeCompare(
            a.nombre_asignado || '',
          );
        case 'area_asc':
          return (a.area || '').localeCompare(b.area || '');
        case 'area_desc':
          return (b.area || '').localeCompare(a.area || '');
        case 'ip_asc':
          return (a.direccion_ip || '').localeCompare(b.direccion_ip || '');
        case 'ip_desc':
          return (b.direccion_ip || '').localeCompare(a.direccion_ip || '');
        default:
          return 0;
      }
    });
  }
}
