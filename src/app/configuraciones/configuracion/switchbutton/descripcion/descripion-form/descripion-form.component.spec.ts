import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescripionFormComponent } from './descripion-form.component';

describe('DescripionFormComponent', () => {
  let component: DescripionFormComponent;
  let fixture: ComponentFixture<DescripionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DescripionFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DescripionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
