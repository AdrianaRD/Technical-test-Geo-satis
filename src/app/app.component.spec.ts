import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { OffenderService } from './services/offender.service';
import { of } from 'rxjs'; // Para simular observables
import { MapComponent } from './components/map/map.component';
import { AddOffenderComponent } from './components/add-offender/add-offender.component';
import { OffenderListComponent } from './components/offender-list/offender-list.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { By } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { provideStore } from '@ngrx/store';
import { offenderReducer } from './store/offender.reducer'; // Asegúrate de tener el reducer
import { provideAnimations } from '@angular/platform-browser/animations';

describe('AppComponent', () => {
  let offenderService: jasmine.SpyObj<OffenderService>;
  let store: jasmine.SpyObj<Store>;

  beforeEach(async () => {
    const offenderServiceSpy = jasmine.createSpyObj('OffenderService', ['getOffenders']);
    const storeSpy = jasmine.createSpyObj('Store', ['dispatch', 'select']); 

    await TestBed.configureTestingModule({
      imports: [AppComponent, MapComponent, AddOffenderComponent, OffenderListComponent, ToolbarComponent],
      providers: [
        { provide: OffenderService, useValue: offenderServiceSpy },
        { provide: Store, useValue: storeSpy },  
        provideStore({ offenders: offenderReducer }),  
        provideAnimations() 
      ]
    }).compileComponents();

    offenderService = TestBed.inject(OffenderService) as jasmine.SpyObj<OffenderService>;
    store = TestBed.inject(Store) as jasmine.SpyObj<Store>;

    offenderService.getOffenders.and.returnValue(of([])); 
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the title 'AdrianaRomero'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('AdrianaRomero');
  });

  it('should load offenders on init', () => {
    const offendersMock = [{ id: 1, firstName: 'John', lastName: 'Doe', homeLocation: '123 Main St', lastKnownPosition: { latitude: 51.5074, longitude: -0.1278 } }];
    offenderService.getOffenders.and.returnValue(of(offendersMock));
  
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    fixture.detectChanges();
  
    expect(app.offenders.length).toBe(1);
    expect(offenderService.getOffenders).toHaveBeenCalled();
  });

  it('should add a new offender to the list', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    const newOffender = { id: 2, firstName: 'Jane', lastName: 'Smith', homeLocation: '456 Elm St', lastKnownPosition: { latitude: 40.7128, longitude: -74.0060 } };

    app.onOffenderAdded(newOffender);

    expect(app.offenders.length).toBe(1);
    expect(app.offenders).toContain(newOffender);
  });

  it('should render toolbar, add-offender, map, and offender-list components', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const toolbar = fixture.debugElement.query(By.directive(ToolbarComponent));
    const map = fixture.debugElement.query(By.directive(MapComponent));
    const addOffender = fixture.debugElement.query(By.directive(AddOffenderComponent));
    const offenderList = fixture.debugElement.query(By.directive(OffenderListComponent));

    expect(toolbar).toBeTruthy();
    expect(map).toBeTruthy();
    expect(addOffender).toBeTruthy();
    expect(offenderList).toBeTruthy();
  });
});
