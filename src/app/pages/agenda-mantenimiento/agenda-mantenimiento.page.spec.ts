import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgendaMantenimientoPage } from './agenda-mantenimiento.page';

describe('AgendaMantenimientoPage', () => {
  let component: AgendaMantenimientoPage;
  let fixture: ComponentFixture<AgendaMantenimientoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AgendaMantenimientoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
