import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalBancosComponent } from './modal-bancos.component';

describe('ModalBancosComponent', () => {
  let component: ModalBancosComponent;
  let fixture: ComponentFixture<ModalBancosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalBancosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalBancosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
