import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuentaBancariaComponent } from './cuenta-bancaria.component';

describe('CuentaBancariaComponent', () => {
  let component: CuentaBancariaComponent;
  let fixture: ComponentFixture<CuentaBancariaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CuentaBancariaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CuentaBancariaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
