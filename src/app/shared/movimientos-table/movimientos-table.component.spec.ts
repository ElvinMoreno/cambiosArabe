import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovimientosTableComponent } from './movimientos-table.component';

describe('MovimientosTableComponent', () => {
  let component: MovimientosTableComponent;
  let fixture: ComponentFixture<MovimientosTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovimientosTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovimientosTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
