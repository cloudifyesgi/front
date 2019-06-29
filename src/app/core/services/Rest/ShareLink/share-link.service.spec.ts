import { TestBed } from '@angular/core/testing';

import { ShareLinkService } from './share-link.service';

describe('ShareLinkService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShareLinkService = TestBed.get(ShareLinkService);
    expect(service).toBeTruthy();
  });
});
