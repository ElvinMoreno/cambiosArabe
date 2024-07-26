import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentasBolivaresComponent } from './ventas-bolivares.component';

describe('VentasBolivaresComponent', () => {
  let component: VentasBolivaresComponent;
  let fixture: ComponentFixture<VentasBolivaresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VentasBolivaresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VentasBolivaresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
