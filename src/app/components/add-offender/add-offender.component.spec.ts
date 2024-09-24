import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OffenderService } from '../../services/offender.service';
import { AddOffenderComponent } from './add-offender.component';
import { of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('AddOffenderComponent', () => {
  let component: AddOffenderComponent;
  let fixture: ComponentFixture<AddOffenderComponent>;
  let offenderService: jasmine.SpyObj<OffenderService>;

  beforeEach(async () => {
    const offenderServiceSpy = jasmine.createSpyObj('OffenderService', ['addOffender']);

    await TestBed.configureTestingModule({
      imports: [AddOffenderComponent, BrowserAnimationsModule],
      providers: [{ provide: OffenderService, useValue: offenderServiceSpy }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddOffenderComponent);
    component = fixture.componentInstance;
    offenderService = TestBed.inject(OffenderService) as jasmine.SpyObj<OffenderService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the modal when clicking the "New Offender" button', () => {
    // Simulate click on "New Offender" button
    const button = fixture.debugElement.nativeElement.querySelector('p-button');
    button.click();
    fixture.detectChanges();

    // Check if modal is visible
    expect(component.displayAddModal).toBeTrue();
  });

  it('should close the modal and reset the form when closing', () => {
    component.closeAddModal();
    fixture.detectChanges();

    // Check if modal is hidden and form reset
    expect(component.displayAddModal).toBeFalse();
    expect(component.newOffender.firstName).toBe('');
    expect(component.newOffender.lastName).toBe('');
    expect(component.newOffender.homeLocation).toBe('');
  });

  it('should validate the form correctly', () => {
    // Initially, form is empty, so it shouldn´t be invalid
    expect(component.isAddFormValid()).toBeFalse();
  
    component.newOffender = {
      firstName: 'John',
      lastName: 'Doe',
      birthDate: '1963-05-24',
      homeLocation: '123 Main St',
      lastKnownPosition: { latitude: '51.5074', longitude: '-0.1278' },
      profileImage: '/assets/img/antonio.jpg'
    };
  
    fixture.detectChanges();
  
    // Now the form should be valid
    expect(component.isAddFormValid()).toBeTrue();
  });

  it('should call addOffender service when form is valid', () => {
    // Fill in valid data
    component.newOffender = {
      firstName: 'John',
      lastName: 'Doe',
      birthDate: '1963-05-24',
      homeLocation: '123 Main St',
      lastKnownPosition: { latitude: '51.5074', longitude: '-0.1278' },
      profileImage: '/assets/img/antonio.jpg'
    };

    // Simulate successful service response
    offenderService.addOffender.and.returnValue(of({ success: true }));

    // Call the method to add offender
    component.addOffender();

    // Check if service was called with correct data
    expect(offenderService.addOffender).toHaveBeenCalledWith({
      firstName: 'John',
      lastName: 'Doe',
      birthDate: '1963-05-24',
      homeLocation: '123 Main St',
      lastKnownPosition: { latitude: '51.5074', longitude: '-0.1278' },
      profileImage: '/assets/img/antonio.jpg'
    });
  });

  it('should not call addOffender service when form is invalid', () => {
    // Leave form empty, making it invalid
    component.newOffender.firstName = '';
    component.newOffender.lastName = '';
    component.newOffender.homeLocation = '';

    // Try to add offender
    component.addOffender();

    // Ensure the service wasn't called
    expect(offenderService.addOffender).not.toHaveBeenCalled();
  });
});
