import { TestBed } from '@angular/core/testing';

import { ResultVotingService } from './result-voting.service';

describe('ResultVotingService', () => {
  let service: ResultVotingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResultVotingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
