import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VotingComponent } from './voting.component';

describe('FeedbackComponent', () => {
  let component: VotingComponent;
  let fixture: ComponentFixture<VotingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VotingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VotingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
