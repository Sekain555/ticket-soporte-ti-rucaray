import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NuevoTicketPage } from './nuevo-ticket.page';

describe('NuevoTicketPage', () => {
  let component: NuevoTicketPage;
  let fixture: ComponentFixture<NuevoTicketPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NuevoTicketPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
