import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Userspage } from './userspage';

describe('Userspage', () => {
  let component: Userspage;
  let fixture: ComponentFixture<Userspage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Userspage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Userspage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
