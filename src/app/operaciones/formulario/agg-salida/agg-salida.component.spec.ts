import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AggSalidaComponent } from './agg-salida.component';

describe('AggSalidaComponent', () => {
  let component: AggSalidaComponent;
  let fixture: ComponentFixture<AggSalidaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AggSalidaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AggSalidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
