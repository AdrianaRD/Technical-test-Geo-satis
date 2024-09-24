import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToolbarComponent } from './toolbar.component';
import { DropdownModule } from 'primeng/dropdown';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import moment from 'moment-timezone';
import { By } from '@angular/platform-browser';

describe('ToolbarComponent', () => {
  let component: ToolbarComponent;
  let fixture: ComponentFixture<ToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToolbarComponent, DropdownModule, OverlayPanelModule, ]
    }).compileComponents();

    fixture = TestBed.createComponent(ToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize timezones and update time', () => {
    expect(component.timezonesDropdown.length).toBeGreaterThan(0); // Comprobar que hay zonas horarias
    expect(component.currentTime).toContain(moment().format('YYYY-MM-DD')); // Comprobar que se muestra la hora actual
  });

  it('should update time when timezone changes', () => {
    component.changeTimezone('Europe/London');
    fixture.detectChanges();

    expect(component.selectedTimezone).toBe('Europe/London');
    expect(component.currentTime).toContain(moment().tz('Europe/London').format('YYYY-MM-DD HH:mm:ss'));
  });

  it('should update time every second', (done) => {
    const previousTime = component.currentTime;
    setTimeout(() => {
      expect(component.currentTime).not.toBe(previousTime);
      done();
    }, 1100);
  });

  it('should toggle the overlay when Admin button is clicked', () => {
    const adminButton = fixture.debugElement.query(By.css('button'));
    spyOn(component, 'changeTimezone');
    
    adminButton.nativeElement.click();
    fixture.detectChanges();

    const overlayPanel = fixture.debugElement.query(By.css('p-overlayPanel'));
    expect(overlayPanel).toBeTruthy();
  });
});
