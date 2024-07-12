import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleBancolombia1Component } from './detalle-bancolombia1.component';

describe('DetalleBancolombia1Component', () => {
  let component: DetalleBancolombia1Component;
  let fixture: ComponentFixture<DetalleBancolombia1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleBancolombia1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleBancolombia1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
