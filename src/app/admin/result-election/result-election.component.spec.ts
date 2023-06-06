import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultElectionComponent } from './result-election.component';

describe('ResultElectionComponent', () => {
  let component: ResultElectionComponent;
  let fixture: ComponentFixture<ResultElectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResultElectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultElectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
