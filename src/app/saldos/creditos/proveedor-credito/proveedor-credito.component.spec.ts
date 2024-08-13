import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProveedorCreditoComponent } from './proveedor-credito.component';

describe('ProveedorCreditoComponent', () => {
  let component: ProveedorCreditoComponent;
  let fixture: ComponentFixture<ProveedorCreditoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProveedorCreditoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProveedorCreditoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
