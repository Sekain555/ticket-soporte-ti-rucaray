import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {

  // Obtiene el rol dinámicamente cada vez que se consulta
  private getRole(): string {
    return localStorage.getItem('rol') || '';
  }

  canEditTickets(): boolean {
    const rol = this.getRole();
    return rol === 'admin' || rol === 'soporte';
  }

  canCloseTickets(): boolean {
    const rol = this.getRole();
    return rol === 'admin' || rol === 'soporte';
  }

  canReopenTickets(): boolean {
    const rol = this.getRole();
    return rol === 'admin' || rol === 'soporte';
  }

  canDeleteTickets(): boolean {
    const rol = this.getRole();
    return rol === 'admin';
  }

  canAssignTickets(): boolean {
    const rol = this.getRole();
    return rol === 'admin' || rol === 'soporte';
  }

  canClassifyTypeTickets(): boolean {
    const rol = this.getRole();
    return rol === 'admin' || rol === 'soporte';
  }
}
