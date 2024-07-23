import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearCuentaBancariaVComponent } from './crear-cuenta-bancaria-v.component';

describe('CrearCuentaBancariaVComponent', () => {
  let component: CrearCuentaBancariaVComponent;
  let fixture: ComponentFixture<CrearCuentaBancariaVComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearCuentaBancariaVComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearCuentaBancariaVComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
