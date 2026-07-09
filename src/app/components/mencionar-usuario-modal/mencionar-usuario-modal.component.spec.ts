import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MencionarUsuarioModalComponent } from './mencionar-usuario-modal.component';

describe('MencionarUsuarioModalComponent', () => {
  let component: MencionarUsuarioModalComponent;
  let fixture: ComponentFixture<MencionarUsuarioModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MencionarUsuarioModalComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MencionarUsuarioModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
