import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntradaBancolombia2Component } from './entrada-bancolombia2.component';

describe('EntradaBancolombia2Component', () => {
  let component: EntradaBancolombia2Component;
  let fixture: ComponentFixture<EntradaBancolombia2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntradaBancolombia2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntradaBancolombia2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
