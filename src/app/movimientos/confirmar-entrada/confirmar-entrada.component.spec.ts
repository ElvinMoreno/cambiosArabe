import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmarEntradaComponent } from './confirmar-entrada.component';

describe('ConfirmarEntradaComponent', () => {
  let component: ConfirmarEntradaComponent;
  let fixture: ComponentFixture<ConfirmarEntradaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmarEntradaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmarEntradaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
