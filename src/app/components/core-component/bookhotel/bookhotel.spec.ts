import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bookhotel } from './bookhotel';

describe('Bookhotel', () => {
  let component: Bookhotel;
  let fixture: ComponentFixture<Bookhotel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Bookhotel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Bookhotel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
