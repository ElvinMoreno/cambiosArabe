import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalConfirmarSalidaComponent } from './modal-confirmar-salida.component';

describe('ModalConfirmarSalidaComponent', () => {
  let component: ModalConfirmarSalidaComponent;
  let fixture: ComponentFixture<ModalConfirmarSalidaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalConfirmarSalidaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalConfirmarSalidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
