import { TestBed } from '@angular/core/testing';

import { ResultElectionService } from './result-election.service';

describe('ResultElectionService', () => {
  let service: ResultElectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResultElectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
