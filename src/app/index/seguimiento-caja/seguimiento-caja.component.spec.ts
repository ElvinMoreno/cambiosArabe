import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguimientoCajaComponent } from './seguimiento-caja.component';

describe('SeguimientoCajaComponent', () => {
  let component: SeguimientoCajaComponent;
  let fixture: ComponentFixture<SeguimientoCajaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeguimientoCajaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeguimientoCajaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
