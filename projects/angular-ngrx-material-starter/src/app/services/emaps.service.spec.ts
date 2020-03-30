import { TestBed } from '@angular/core/testing';

import { EmapsService } from './emaps.service';

describe('EmapsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EmapsService = TestBed.get(EmapsService);
    expect(service).toBeTruthy();
  });
});
