import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { OffenderService } from '../../services/offender.service';
import { OffenderModalComponent } from '../offender-modal/offender-modal.component';

@Component({
  selector: 'app-add-offender',
  standalone: true,
  imports: [CommonModule, ButtonModule, DialogModule, FormsModule, OffenderModalComponent, OffenderModalComponent],
  templateUrl: './add-offender.component.html',
  styleUrl: './add-offender.component.css'
})
export class AddOffenderComponent {
  @Output() offenderAdded = new EventEmitter<any>(); // Evento para notificar al padre

  displayAddModal: boolean = false;
  newOffender: any = {
    firstName: '',
    lastName: '',
    birthDate: '',
    homeLocation: '',
    lastKnownPosition: { latitude: '', longitude: '' },
    profileImage: ''
  };

  constructor(private offenderService: OffenderService) { }

  showAddOffenderModal(): void {
    this.displayAddModal = true;
  }

  closeAddModal(): void {
    this.displayAddModal = false;
    this.resetNewOffender();
  }

  // Reset the form
  resetNewOffender(): void {
    this.newOffender = {
      firstName: '',
      lastName: '',
      birthDate: '',
      homeLocation: '',
      lastKnownPosition: { latitude: '', longitude: '' },
      profileImage: ''
    };
  }

  // Validate form
  isAddFormValid(): boolean {
    return this.newOffender.firstName && this.newOffender.lastName && this.newOffender.homeLocation &&
      !!this.newOffender.lastKnownPosition.latitude && !!this.newOffender.lastKnownPosition.longitude;
  }


  addOffender(): void {
    if (this.isAddFormValid()) {
      this.offenderService.addOffender(this.newOffender).subscribe(response => {
        console.log('Offender added successfully', response);

        // Emit the new offender to parent component
        this.offenderAdded.emit(this.newOffender);

        this.closeAddModal();
      }, error => {
        console.error('Failed to add offender', error);
      });
    }
  }
}
