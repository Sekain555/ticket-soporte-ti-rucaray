import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProgramarMantenimientoPage } from './programar-mantenimiento.page';

describe('ProgramarMantenimientoPage', () => {
  let component: ProgramarMantenimientoPage;
  let fixture: ComponentFixture<ProgramarMantenimientoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramarMantenimientoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
