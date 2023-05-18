import { TestBed } from '@angular/core/testing';

import { ShareholderInfoService } from './shareholder-info.service';

describe('ShareholderInfoService', () => {
  let service: ShareholderInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShareholderInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
