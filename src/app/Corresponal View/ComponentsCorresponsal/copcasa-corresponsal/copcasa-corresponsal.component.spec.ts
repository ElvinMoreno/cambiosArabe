import { ComponentFixture, TestBed } from '@angular/core/testing';

import { COPCasaCorresponsalComponent } from './copcasa-corresponsal.component';

describe('COPCasaCorresponsalComponent', () => {
  let component: COPCasaCorresponsalComponent;
  let fixture: ComponentFixture<COPCasaCorresponsalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [COPCasaCorresponsalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(COPCasaCorresponsalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
