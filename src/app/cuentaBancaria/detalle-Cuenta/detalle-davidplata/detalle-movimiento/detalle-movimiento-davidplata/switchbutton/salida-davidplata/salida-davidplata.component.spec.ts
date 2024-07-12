import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalidaDavidplataComponent } from './salida-davidplata.component';

describe('SalidaDavidplataComponent', () => {
  let component: SalidaDavidplataComponent;
  let fixture: ComponentFixture<SalidaDavidplataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalidaDavidplataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalidaDavidplataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
