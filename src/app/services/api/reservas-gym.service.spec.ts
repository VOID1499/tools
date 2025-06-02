import { TestBed } from '@angular/core/testing';

import { ReservasGymService } from './reservas-gym.service';

describe('ReservasGymService', () => {
  let service: ReservasGymService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReservasGymService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
