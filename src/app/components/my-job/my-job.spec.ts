import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyJob } from './my-job';

describe('MyJob', () => {
  let component: MyJob;
  let fixture: ComponentFixture<MyJob>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyJob]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyJob);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
