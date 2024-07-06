import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentPolaniaComponent } from './content-polania.component';

describe('ContentPolaniaComponent', () => {
  let component: ContentPolaniaComponent;
  let fixture: ComponentFixture<ContentPolaniaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentPolaniaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentPolaniaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
