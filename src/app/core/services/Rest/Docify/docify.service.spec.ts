import { TestBed } from '@angular/core/testing';

import { DocifyService } from './docify.service';

describe('DocifyService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DocifyService = TestBed.get(DocifyService);
    expect(service).toBeTruthy();
  });
});
