import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientesCreditosComponent } from './clientes-creditos.component';

describe('ClientesCreditosComponent', () => {
  let component: ClientesCreditosComponent;
  let fixture: ComponentFixture<ClientesCreditosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientesCreditosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientesCreditosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
