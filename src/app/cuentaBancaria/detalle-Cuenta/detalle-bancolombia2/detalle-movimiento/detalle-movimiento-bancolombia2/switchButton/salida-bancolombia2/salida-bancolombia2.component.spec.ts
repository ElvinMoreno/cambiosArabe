import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalidaBancolombia2Component } from './salida-bancolombia2.component';

describe('SalidaBancolombia2Component', () => {
  let component: SalidaBancolombia2Component;
  let fixture: ComponentFixture<SalidaBancolombia2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalidaBancolombia2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalidaBancolombia2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
