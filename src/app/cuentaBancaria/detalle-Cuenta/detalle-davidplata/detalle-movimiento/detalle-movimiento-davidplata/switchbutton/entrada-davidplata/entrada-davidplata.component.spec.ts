import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntradaDavidplataComponent } from './entrada-davidplata.component';

describe('EntradaDavidplataComponent', () => {
  let component: EntradaDavidplataComponent;
  let fixture: ComponentFixture<EntradaDavidplataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntradaDavidplataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntradaDavidplataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
