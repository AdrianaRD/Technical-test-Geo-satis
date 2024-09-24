import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { OffenderService } from './offender.service';

describe('OffenderService', () => {
  let service: OffenderService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],  // Importa HttpClientTestingModule
      providers: [OffenderService],
    });
    service = TestBed.inject(OffenderService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch offenders using GET request', () => {
    const mockOffenders = [
      { id: 1, firstName: 'John', lastName: 'Doe' },
      { id: 2, firstName: 'Jane', lastName: 'Smith' },
    ];

    service.getOffenders().subscribe((offenders) => {
      expect(offenders.length).toBe(2);
      expect(offenders).toEqual(mockOffenders);
    });

    const req = httpMock.expectOne('assets/data/offenders.json');
    expect(req.request.method).toBe('GET');
  });

  it('should update an offender and return success response', () => {
    const updatedOffender = { id: 1, firstName: 'John', lastName: 'Updated Doe' };

    service.updateOffender(updatedOffender).subscribe((response) => {
      expect(response.success).toBeTrue();
      expect(response.offender).toEqual(updatedOffender);
    });

  });

  it('should add a new offender and return success response', () => {
    const newOffender = { id: 3, firstName: 'Mark', lastName: 'Johnson' };

    service.addOffender(newOffender).subscribe((response) => {
      expect(response.success).toBeTrue();
      expect(response.offender).toEqual(newOffender);
    });

  });
});
