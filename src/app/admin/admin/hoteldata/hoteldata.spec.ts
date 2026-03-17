import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Hoteldata } from './hoteldata';

describe('Hoteldata', () => {
  let component: Hoteldata;
  let fixture: ComponentFixture<Hoteldata>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Hoteldata]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Hoteldata);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
