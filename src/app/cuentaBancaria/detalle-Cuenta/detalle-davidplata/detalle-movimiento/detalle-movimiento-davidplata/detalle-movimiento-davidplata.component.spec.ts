import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleMovimientoDavidplataComponent } from './detalle-movimiento-davidplata.component';

describe('DetalleMovimientoDavidplataComponent', () => {
  let component: DetalleMovimientoDavidplataComponent;
  let fixture: ComponentFixture<DetalleMovimientoDavidplataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleMovimientoDavidplataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleMovimientoDavidplataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
