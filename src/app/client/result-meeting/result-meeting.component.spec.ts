import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultMeetingComponent } from './result-meeting.component';

describe('ResultMeetingComponent', () => {
  let component: ResultMeetingComponent;
  let fixture: ComponentFixture<ResultMeetingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResultMeetingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultMeetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
