import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Dashboard } from './dashboard';
declare var $: any;


describe('Dashboard', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dashboard]
    })
      .compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  
});

// export class MyFormComponent {
//     showForm: boolean = true;

//     hideForm() {
//       this.showForm = false;
//     }
//   }
