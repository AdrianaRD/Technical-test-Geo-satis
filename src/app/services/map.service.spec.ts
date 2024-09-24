import { TestBed } from '@angular/core/testing';
import { MapService } from './map.service';

describe('MapService', () => {
  let service: MapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit correct coordinates when moveToLocation is called', (done: DoneFn) => {
    const latitude = 51.5074;
    const longitude = -0.1278;

    // Subscribe to the observable to check if it emits the correct values
    service.offenderLocation$.subscribe((location) => {
      expect(location.latitude).toBe(latitude);
      expect(location.longitude).toBe(longitude);
      done();
    });

    service.moveToLocation(latitude, longitude);
  });
});
