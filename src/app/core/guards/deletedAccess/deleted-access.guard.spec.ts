import { TestBed, async, inject } from '@angular/core/testing';

import { DeletedAccessGuard } from './deleted-access.guard';

describe('DeletedAccessGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DeletedAccessGuard]
    });
  });

  it('should ...', inject([DeletedAccessGuard], (guard: DeletedAccessGuard) => {
    expect(guard).toBeTruthy();
  }));
});
