import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarCuentasColombianasComponent } from './listar-cuentas-colombianas.component';

describe('ListarCuentasColombianasComponent', () => {
  let component: ListarCuentasColombianasComponent;
  let fixture: ComponentFixture<ListarCuentasColombianasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarCuentasColombianasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarCuentasColombianasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
