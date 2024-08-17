import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleMovimientoCompGenComponent } from './detalle-movimiento-comp-gen.component';

describe('DetalleMovimientoCompGenComponent', () => {
  let component: DetalleMovimientoCompGenComponent;
  let fixture: ComponentFixture<DetalleMovimientoCompGenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleMovimientoCompGenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleMovimientoCompGenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
