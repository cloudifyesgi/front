import { TestBed, async, inject } from '@angular/core/testing';

import { DirectoryAccessGuard } from './directory-access.guard';

describe('DirectoryAccessGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DirectoryAccessGuard]
    });
  });

  it('should ...', inject([DirectoryAccessGuard], (guard: DirectoryAccessGuard) => {
    expect(guard).toBeTruthy();
  }));
});
