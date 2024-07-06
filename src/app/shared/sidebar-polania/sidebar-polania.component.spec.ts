import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarPolaniaComponent } from './sidebar-polania.component';

describe('SidebarPolaniaComponent', () => {
  let component: SidebarPolaniaComponent;
  let fixture: ComponentFixture<SidebarPolaniaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarPolaniaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarPolaniaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
