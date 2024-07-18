import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuentaVenezolanaComponent } from './cuenta-venezolana.component';

describe('CuentaVenezolanaComponent', () => {
  let component: CuentaVenezolanaComponent;
  let fixture: ComponentFixture<CuentaVenezolanaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CuentaVenezolanaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CuentaVenezolanaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
