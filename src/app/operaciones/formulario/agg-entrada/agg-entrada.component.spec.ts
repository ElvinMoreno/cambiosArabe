import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AggEntradaComponent } from './agg-entrada.component';

describe('AggEntradaComponent', () => {
  let component: AggEntradaComponent;
  let fixture: ComponentFixture<AggEntradaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AggEntradaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AggEntradaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
