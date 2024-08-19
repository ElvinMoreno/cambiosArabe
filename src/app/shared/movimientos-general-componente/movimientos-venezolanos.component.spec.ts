import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovimientosVenezolanosComponent } from './movimientos-venezolanos.component';

describe('MovimientosVenezolanosComponent', () => {
  let component: MovimientosVenezolanosComponent;
  let fixture: ComponentFixture<MovimientosVenezolanosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovimientosVenezolanosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovimientosVenezolanosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
