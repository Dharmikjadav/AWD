import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Navbaradmin } from './navbaradmin';

describe('Navbaradmin', () => {
  let component: Navbaradmin;
  let fixture: ComponentFixture<Navbaradmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Navbaradmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Navbaradmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
