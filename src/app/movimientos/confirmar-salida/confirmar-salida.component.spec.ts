import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmarSalidaComponent } from './confirmar-salida.component';

describe('ConfirmarSalidaComponent', () => {
  let component: ConfirmarSalidaComponent;
  let fixture: ComponentFixture<ConfirmarSalidaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmarSalidaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmarSalidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
