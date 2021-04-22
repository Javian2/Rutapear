import { TestBed } from '@angular/core/testing';

import { SelladoService } from './sellado.service';

describe('SelladoService', () => {
  let service: SelladoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelladoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
