import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CajaCorresponsalComponent } from './caja-corresponsal.component';

describe('CajaCorresponsalComponent', () => {
  let component: CajaCorresponsalComponent;
  let fixture: ComponentFixture<CajaCorresponsalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CajaCorresponsalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CajaCorresponsalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
