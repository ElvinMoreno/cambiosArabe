import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleDavidplataComponent } from './detalle-davidplata.component';

describe('DetalleDavidplataComponent', () => {
  let component: DetalleDavidplataComponent;
  let fixture: ComponentFixture<DetalleDavidplataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleDavidplataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleDavidplataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
