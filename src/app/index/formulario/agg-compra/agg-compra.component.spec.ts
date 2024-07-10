import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AggCompraComponent } from './agg-compra.component';

describe('AggCompraComponent', () => {
  let component: AggCompraComponent;
  let fixture: ComponentFixture<AggCompraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AggCompraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AggCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
