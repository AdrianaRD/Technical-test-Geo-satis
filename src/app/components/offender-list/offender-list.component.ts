import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { OffenderService } from '../../services/offender.service';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { OffenderModalComponent } from '../offender-modal/offender-modal.component';
import { MapService } from '../../services/map.service';
import { Store } from '@ngrx/store';
import { setVisibleOffenders } from '../../store/offender.actions';

@Component({
  selector: 'app-offender-list',
  standalone: true,
  imports: [CommonModule, TableModule, DialogModule, FormsModule, ButtonModule, OffenderModalComponent],
  templateUrl: './offender-list.component.html',
  styleUrls: ['./offender-list.component.css']
})
export class OffenderListComponent implements OnInit {
  @Input() offenders: any[] = [];
  @Output() visibleOffendersChange = new EventEmitter<any[]>();
  displayModal: boolean = false;
  selectedOffender: any = null;
  activeOffenderId: number | null = null;


  constructor(private offenderService: OffenderService, private mapService: MapService, private store: Store) { }

  ngOnInit(): void {
    this.offenderService.getOffenders().subscribe((data) => {
      this.offenders = data;
      this.emitVisibleOffenders(0, 5);
    });
  }
  isFormValid(): boolean {
    return this.selectedOffender.firstName &&
      this.selectedOffender.lastName &&
      this.selectedOffender.homeLocation &&
      this.selectedOffender.lastKnownPosition.latitude &&
      this.selectedOffender.lastKnownPosition.longitude;
  }
  updateOffender(): void {
    if (this.isFormValid()) {
      const offenderIndex = this.offenders.findIndex(offender => offender.id === this.selectedOffender.id);

      if (offenderIndex !== -1) {
        // Update local offenders list
        this.offenders[offenderIndex] = { ...this.selectedOffender };

        this.offenders = [...this.offenders];

        this.offenderService.updateOffender(this.selectedOffender).subscribe(response => {
          console.log('Offender data updated on the server', response);
        }, error => {
          console.error('Failed to update offender on the server', error);
        });
      }
      // Close modal after update
      this.closeModal();
    }
  }

  closeModal(): void {
    this.displayModal = false;
    this.selectedOffender = null; // Resetea el ofensor seleccionado
    this.activeOffenderId = null; // Desactiva el icono activo
  }

  // Open modal and assign selected offender
  openEditModal(offender: any): void {
    this.selectedOffender = { ...offender };
    this.displayModal = true;
    this.activeOffenderId = offender.id;
  }
  onOffenderAdded(newOffender: any): void {
    this.offenders = [...this.offenders, newOffender];
  }


  onPageChange(event: any): void {
    const start = event.first;
    const end = event.first + event.rows;
    const visibleOffenders = this.offenders.slice(start, end);

    this.visibleOffendersChange.emit(visibleOffenders);

    this.store.dispatch(setVisibleOffenders({ visibleOffenders }));
  }


  emitVisibleOffenders(start: number, end: number): void {
    const visibleOffenders = this.offenders.slice(start, end);
    console.log('Visible offenders:', visibleOffenders);
    this.visibleOffendersChange.emit(visibleOffenders);
  }

  onRowClick(offender: any): void {
    if (offender.lastKnownPosition && offender.lastKnownPosition.latitude && offender.lastKnownPosition.longitude) {
      this.mapService.moveToLocation(offender.lastKnownPosition.latitude, offender.lastKnownPosition.longitude);
    }
  }

}
