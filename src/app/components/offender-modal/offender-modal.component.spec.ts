import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OffenderModalComponent } from './offender-modal.component';
import { FormsModule } from '@angular/forms';

describe('OffenderModalComponent', () => {
  let component: OffenderModalComponent;
  let fixture: ComponentFixture<OffenderModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OffenderModalComponent, FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(OffenderModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close the modal when closeModal is called', () => {
    spyOn(component.modalClosed, 'emit');

    component.closeModal();


    expect(component.modalClosed.emit).toHaveBeenCalled();
  });

  it('should validate the form correctly', () => {
    component.offender = {
      firstName: 'John',
      lastName: 'Doe',
      homeLocation: '123 Main St',
      lastKnownPosition: { latitude: '51.5074', longitude: '-0.1278' }
    };
    fixture.detectChanges();
    expect(component.isFormValid()).toBeTrue();
  });

  it('should emit offenderSaved and close modal when saveOffender is called with valid data', () => {
    spyOn(component.offenderSaved, 'emit');
    spyOn(component, 'closeModal');

    component.offender.firstName = 'John';
    component.offender.lastName = 'Doe';
    component.offender.homeLocation = '123 Main St';
    component.offender.lastKnownPosition.latitude = '51.5074';
    component.offender.lastKnownPosition.longitude = '-0.1278';

    component.saveOffender();

    expect(component.offenderSaved.emit).toHaveBeenCalledWith(component.offender);

    expect(component.closeModal).toHaveBeenCalled();
  });

  it('should not allow non-letter characters in the first name and last name fields', () => {
    const event = new KeyboardEvent('keypress', { key: '1', code: 'Digit1' }); // Simular un número (no permitido)

    spyOn(event, 'preventDefault'); // Espiar preventDefault

    component.allowLettersAndSpaces(event);

    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should not allow non-numeric characters in latitude and longitude fields', () => {
    const event = new KeyboardEvent('keypress', { key: 'A', code: 'KeyA' });
    spyOn(event, 'preventDefault'); // Espiar preventDefault

    component.allowNumbersAndSymbols(event);

    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should allow numbers and symbols in latitude and longitude fields', () => {
    const event = new KeyboardEvent('keypress', { key: '1', code: 'Digit1' });
    const symbolEvent = new KeyboardEvent('keypress', { key: '.', code: 'Period' });

    spyOn(event, 'preventDefault'); 
    spyOn(symbolEvent, 'preventDefault');

    component.allowNumbersAndSymbols(event);
    component.allowNumbersAndSymbols(symbolEvent);
    expect(event.preventDefault).not.toHaveBeenCalled();
    expect(symbolEvent.preventDefault).not.toHaveBeenCalled();
  });
});
