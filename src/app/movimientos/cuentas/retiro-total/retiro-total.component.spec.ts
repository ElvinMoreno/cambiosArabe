import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetiroTotalComponent } from './retiro-total.component';

describe('RetiroTotalComponent', () => {
  let component: RetiroTotalComponent;
  let fixture: ComponentFixture<RetiroTotalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RetiroTotalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RetiroTotalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
