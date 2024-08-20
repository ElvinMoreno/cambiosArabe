import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmarEntradaBsComponent } from './confirmar-entrada-bs.component';

describe('ConfirmarEntradaBsComponent', () => {
  let component: ConfirmarEntradaBsComponent;
  let fixture: ComponentFixture<ConfirmarEntradaBsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmarEntradaBsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmarEntradaBsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
