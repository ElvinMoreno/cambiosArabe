import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearCuentaBancariaComponent } from './crear-cuenta-bancaria.component';

describe('CrearCuentaBancariaComponent', () => {
  let component: CrearCuentaBancariaComponent;
  let fixture: ComponentFixture<CrearCuentaBancariaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearCuentaBancariaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearCuentaBancariaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
