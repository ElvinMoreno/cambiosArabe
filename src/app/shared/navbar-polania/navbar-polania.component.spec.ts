import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarPolaniaComponent } from './navbar-polania.component';

describe('NavbarPolaniaComponent', () => {
  let component: NavbarPolaniaComponent;
  let fixture: ComponentFixture<NavbarPolaniaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarPolaniaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarPolaniaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
