import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MapComponent } from './map.component';
import { MapService } from '../../services/map.service';
import { of } from 'rxjs';

describe('MapComponent', () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;
  let mapService: jasmine.SpyObj<MapService>;

  beforeEach(async () => {
    const mapServiceSpy = jasmine.createSpyObj('MapService', [], {
      offenderLocation$: of({ latitude: 51.5074, longitude: -0.1278 })
    });

    await TestBed.configureTestingModule({
      imports: [MapComponent],
      providers: [{ provide: MapService, useValue: mapServiceSpy }]
    })
      .compileComponents();

    fixture = TestBed.createComponent(MapComponent);
    component = fixture.componentInstance;
    mapService = TestBed.inject(MapService) as jasmine.SpyObj<MapService>;
    fixture.detectChanges();
  });

  afterEach(() => {
    if (component['map']) {
      // Remove map after each test
      component['map'].remove();
    }
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the map', () => {
    const mapInitSpy = spyOn<any>(component, 'initMap').and.callThrough();
    component.ngOnInit();
    expect(mapInitSpy).toHaveBeenCalled();
  });

  it('should subscribe to offenderLocation$ and move the map', () => {
    const offenderLocationMock = { latitude: 51.5074, longitude: -0.1278 };
    const mapSetViewSpy = spyOn(component['map'], 'setView').and.callThrough();
    component.ngOnInit();
    expect(mapSetViewSpy).toHaveBeenCalledWith([offenderLocationMock.latitude, offenderLocationMock.longitude], 40);
  });

  it('should update markers when visibleOffenders changes', () => {
    const offendersMock = [
      {
        firstName: 'John',
        lastName: 'Doe',
        homeLocation: '123 Main St',
        lastKnownPosition: { latitude: 51.5074, longitude: -0.1278 }
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        homeLocation: '456 Elm St',
        lastKnownPosition: { latitude: 40.7128, longitude: -74.0060 }
      }
    ];

    component.visibleOffenders = offendersMock;

    // Spy on marker update
    const updateMarkersSpy = spyOn<any>(component, 'updateMarkers').and.callThrough();

    component.ngOnChanges({
      visibleOffenders: {
        currentValue: offendersMock,
        previousValue: [],
        firstChange: true,
        isFirstChange: () => true
      }
    });

    // Check if updateMarkers was called
    expect(updateMarkersSpy).toHaveBeenCalled();
  });

  it('should clear markers when there are no visible offenders', () => {
    const clearLayersSpy = spyOn(component['markersLayer'], 'clearLayers');
    component.visibleOffenders = [];
    component.ngOnChanges({
      visibleOffenders: {
        currentValue: [],
        previousValue: [],
        firstChange: false,
        isFirstChange: () => false
      }
    });
    expect(clearLayersSpy).toHaveBeenCalled();
  });
});
