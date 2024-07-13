import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleMovimientoBancolombia2Component } from './detalle-movimiento-bancolombia2.component';

describe('DetalleMovimientoBancolombia2Component', () => {
  let component: DetalleMovimientoBancolombia2Component;
  let fixture: ComponentFixture<DetalleMovimientoBancolombia2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleMovimientoBancolombia2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleMovimientoBancolombia2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
