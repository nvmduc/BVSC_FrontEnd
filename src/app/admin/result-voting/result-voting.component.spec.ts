import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultVotingComponent } from './result-voting.component';

describe('ResultVotingComponent', () => {
  let component: ResultVotingComponent;
  let fixture: ComponentFixture<ResultVotingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResultVotingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultVotingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
