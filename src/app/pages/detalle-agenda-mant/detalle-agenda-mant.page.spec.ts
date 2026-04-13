import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetalleAgendaMantPage } from './detalle-agenda-mant.page';

describe('DetalleAgendaMantPage', () => {
  let component: DetalleAgendaMantPage;
  let fixture: ComponentFixture<DetalleAgendaMantPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleAgendaMantPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
