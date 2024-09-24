import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private offenderLocationSource = new Subject<{ latitude: number, longitude: number }>();
  offenderLocation$ = this.offenderLocationSource.asObservable();
  
  // Method to emit new coordinates
  moveToLocation(latitude: number, longitude: number) {
    this.offenderLocationSource.next({ latitude, longitude });
  }
}
