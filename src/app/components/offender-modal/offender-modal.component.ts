import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-offender-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, DialogModule, ButtonModule],
  templateUrl: './offender-modal.component.html',
  styleUrls: ['./offender-modal.component.css']
})
export class OffenderModalComponent {
  @Input() offender: any = {
    firstName: '',
    lastName: '',
    birthDate: '',
    homeLocation: '',
    lastKnownPosition: { latitude: '', longitude: '' },
    profileImage: ''
  };
  // Controls modal visibility
  @Input() displayModal: boolean = false;
  // Determines if it's an add or edit modal
  @Input() modalType: 'add' | 'edit' = 'add';

  @Output() offenderSaved = new EventEmitter<any>();
  @Output() modalClosed = new EventEmitter<void>();

  closeModal(): void {
    this.modalClosed.emit();
  }

  // Validate if the form is valid
  isFormValid(): boolean {
    return this.offender.firstName &&
      this.offender.lastName &&
      this.offender.homeLocation &&
      this.offender.lastKnownPosition?.latitude &&
      this.offender.lastKnownPosition?.longitude;
  }

  // Add or update the offender
  saveOffender(): void {
    if (this.isFormValid()) {
      this.offenderSaved.emit(this.offender);
      this.closeModal();
    }
  }

  allowLettersAndSpaces(event: KeyboardEvent): void {
    const regex = /^[a-zA-Z\s]*$/;
    const key = event.key;
    if (!regex.test(key)) {
      event.preventDefault();
    }
  }

  allowNumbersAndSymbols(event: KeyboardEvent): void {
    const regex = /^[0-9.\-+]*$/;
    const key = event.key;
    if (!regex.test(key)) {
      event.preventDefault();
    }
  }
}
