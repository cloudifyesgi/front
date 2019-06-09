import { TestBed } from '@angular/core/testing';

import { ConstantesService } from './constantes.service';

describe('ConstantesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConstantesService = TestBed.get(ConstantesService);
    expect(service).toBeTruthy();
  });
});
