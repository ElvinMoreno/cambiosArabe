import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuentaColombianaComponent } from './cuenta-colombiana.component';

describe('CuentaColombianaComponent', () => {
  let component: CuentaColombianaComponent;
  let fixture: ComponentFixture<CuentaColombianaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CuentaColombianaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CuentaColombianaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
