import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprasBolivaresComponent } from './compras-bolivares.component';

describe('ComprasBolivaresComponent', () => {
  let component: ComprasBolivaresComponent;
  let fixture: ComponentFixture<ComprasBolivaresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComprasBolivaresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComprasBolivaresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
