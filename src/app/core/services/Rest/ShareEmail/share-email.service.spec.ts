import { TestBed } from '@angular/core/testing';

import { ShareEmailService } from './share-email.service';

describe('ShareEmailService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShareEmailService = TestBed.get(ShareEmailService);
    expect(service).toBeTruthy();
  });
});
