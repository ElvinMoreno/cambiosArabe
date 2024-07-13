import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntradaBancolombia1Component } from './entrada-bancolombia1.component';

describe('EntradaBancolombia1Component', () => {
  let component: EntradaBancolombia1Component;
  let fixture: ComponentFixture<EntradaBancolombia1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntradaBancolombia1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntradaBancolombia1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
