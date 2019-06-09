import { TestBed } from '@angular/core/testing';

import { RestRequestService } from './rest-request.service';

describe('RestRequestService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RestRequestService = TestBed.get(RestRequestService);
    expect(service).toBeTruthy();
  });
});
