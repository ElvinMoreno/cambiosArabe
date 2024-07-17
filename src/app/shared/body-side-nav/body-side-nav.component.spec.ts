import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BodySideNavComponent } from './body-side-nav.component';

describe('BodySideNavComponent', () => {
  let component: BodySideNavComponent;
  let fixture: ComponentFixture<BodySideNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BodySideNavComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BodySideNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
