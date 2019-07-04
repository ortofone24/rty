import { TestBed } from '@angular/core/testing';

import { PierwiastkiPriceService } from './pierwiastki-price.service';

describe('PierwiastkiPriceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PierwiastkiPriceService = TestBed.get(PierwiastkiPriceService);
    expect(service).toBeTruthy();
  });
});
