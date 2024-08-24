import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualizarCuentaBancariaComponent } from './actualizar-cuenta-bancaria.component';

describe('ActualizarCuentaBancariaComponent', () => {
  let component: ActualizarCuentaBancariaComponent;
  let fixture: ComponentFixture<ActualizarCuentaBancariaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActualizarCuentaBancariaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActualizarCuentaBancariaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
