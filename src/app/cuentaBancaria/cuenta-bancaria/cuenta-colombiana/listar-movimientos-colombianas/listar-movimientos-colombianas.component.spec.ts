import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarMovimientosColombianasComponent } from './listar-movimientos-colombianas.component';

describe('ListarMovimientosColombianasComponent', () => {
  let component: ListarMovimientosColombianasComponent;
  let fixture: ComponentFixture<ListarMovimientosColombianasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarMovimientosColombianasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarMovimientosColombianasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
