import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleMovimientoBancolombia1Component } from './detalle-movimiento-bancolombia1.component';

describe('DetalleMovimientoBancolombia1Component', () => {
  let component: DetalleMovimientoBancolombia1Component;
  let fixture: ComponentFixture<DetalleMovimientoBancolombia1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleMovimientoBancolombia1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleMovimientoBancolombia1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
