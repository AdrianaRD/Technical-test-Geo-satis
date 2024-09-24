import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OffenderListComponent } from './offender-list.component';
import { OffenderService } from '../../services/offender.service';
import { MapService } from '../../services/map.service';
import { of } from 'rxjs'; // To mock observables
import { Store } from '@ngrx/store';

describe('OffenderListComponent', () => {
  let component: OffenderListComponent;
  let fixture: ComponentFixture<OffenderListComponent>;
  let offenderService: jasmine.SpyObj<OffenderService>;
  let mapService: jasmine.SpyObj<MapService>;
  let store: jasmine.SpyObj<Store>;

  beforeEach(async () => {
    const offenderServiceSpy = jasmine.createSpyObj('OffenderService', ['getOffenders', 'updateOffender']);
    const mapServiceSpy = jasmine.createSpyObj('MapService', ['moveToLocation']);
    const storeSpy = jasmine.createSpyObj('Store', ['dispatch']);

    await TestBed.configureTestingModule({
      imports: [OffenderListComponent],
      providers: [
        { provide: OffenderService, useValue: offenderServiceSpy },
        { provide: MapService, useValue: mapServiceSpy },
        { provide: Store, useValue: storeSpy }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(OffenderListComponent);
    component = fixture.componentInstance;
    offenderService = TestBed.inject(OffenderService) as jasmine.SpyObj<OffenderService>;
    mapService = TestBed.inject(MapService) as jasmine.SpyObj<MapService>;
    store = TestBed.inject(Store) as jasmine.SpyObj<Store>;

    // Mock response from service with a list of offenders
    offenderService.getOffenders.and.returnValue(of([
      { id: 1, firstName: 'John', lastName: 'Doe', homeLocation: '123 Main St', lastKnownPosition: { latitude: 51.5074, longitude: -0.1278 } },
      { id: 2, firstName: 'Jane', lastName: 'Smith', homeLocation: '456 Elm St', lastKnownPosition: { latitude: 40.7128, longitude: -74.0060 } }
    ]));

    // Spy on emit method
    spyOn(component.visibleOffendersChange, 'emit');

    offenderService.updateOffender.and.returnValue(of({ success: true }));

    fixture.detectChanges(); // Initialize the component
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize offenders and emit the first 5 visible offenders', () => {
    // Ensure getOffenders was called
    expect(offenderService.getOffenders).toHaveBeenCalled();

    // Check offenders were loaded correctly
    expect(component.offenders.length).toBe(2);

    // Verify the first visible offenders were emitted
    expect(component.visibleOffendersChange.emit).toHaveBeenCalledWith([
      { id: 1, firstName: 'John', lastName: 'Doe', homeLocation: '123 Main St', lastKnownPosition: { latitude: 51.5074, longitude: -0.1278 } },
      { id: 2, firstName: 'Jane', lastName: 'Smith', homeLocation: '456 Elm St', lastKnownPosition: { latitude: 40.7128, longitude: -74.0060 } }
    ]);
  });

  it('should open the edit modal when clicking the edit icon', () => {
    const offenderMock = { id: 1, firstName: 'John', lastName: 'Doe', homeLocation: '123 Main St', lastKnownPosition: { latitude: 51.5074, longitude: -0.1278 } };

    component.openEditModal(offenderMock);

    // Check if the modal opened and offender was selected
    expect(component.displayModal).toBeTrue();
    expect(component.selectedOffender).toEqual(offenderMock);
  });

  it('should update offenders when updateOffender is called', () => {
    const offenderMock = { id: 1, firstName: 'John', lastName: 'Doe', homeLocation: '123 Main St', lastKnownPosition: { latitude: 51.5074, longitude: -0.1278 } };

    component.selectedOffender = { ...offenderMock, lastName: 'Updated Doe' };

    component.updateOffender();

    // Check offender was updated correctly in the list
    expect(component.offenders[0].lastName).toBe('Updated Doe');

    // Verify the service was called to update the offender
    expect(offenderService.updateOffender).toHaveBeenCalledWith(component.selectedOffender);
  });

  it('should emit visible offenders when the page changes', () => {
    const pageEventMock = { first: 0, rows: 1 }; // Simulate pagination of 1 record per page

    // Simulate page change
    component.onPageChange(pageEventMock);

    expect(component.visibleOffendersChange.emit).toHaveBeenCalledWith([
      { id: 1, firstName: 'John', lastName: 'Doe', homeLocation: '123 Main St', lastKnownPosition: { latitude: 51.5074, longitude: -0.1278 } }
    ]);
  });

  it('should move the map to the offender location when a row is clicked', () => {
    const offenderMock = { firstName: 'John', lastName: 'Doe', lastKnownPosition: { latitude: 51.5074, longitude: -0.1278 } };

    component.onRowClick(offenderMock);

    // Check mapService was called to move to the correct location
    expect(mapService.moveToLocation).toHaveBeenCalledWith(offenderMock.lastKnownPosition.latitude, offenderMock.lastKnownPosition.longitude);
  });
});
