import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalidaBancolombia1Component } from './salida-bancolombia1.component';

describe('SalidaBancolombia1Component', () => {
  let component: SalidaBancolombia1Component;
  let fixture: ComponentFixture<SalidaBancolombia1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalidaBancolombia1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalidaBancolombia1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
