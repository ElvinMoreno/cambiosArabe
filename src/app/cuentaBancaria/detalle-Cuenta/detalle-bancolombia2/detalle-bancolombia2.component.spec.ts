import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleBancolombia2Component } from './detalle-bancolombia2.component';

describe('DetalleBancolombia2Component', () => {
  let component: DetalleBancolombia2Component;
  let fixture: ComponentFixture<DetalleBancolombia2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleBancolombia2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleBancolombia2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
