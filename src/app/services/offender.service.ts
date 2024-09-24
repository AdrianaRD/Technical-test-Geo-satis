import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OffenderService {
  private dataUrl = 'assets/data/offenders.json';

  constructor(private http: HttpClient) { }

  getOffenders(): Observable<any> {
    return this.http.get<any>(this.dataUrl);
  }

  // Method to update an offender
  updateOffender(updatedOffender: any): Observable<any> {

    // En una aplicación real, se enviaría una solicitud PUT o PATCH a una API real
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    
    // Simulate a successful response
    return of({
      success: true,
      offender: updatedOffender
    });
  }
  addOffender(newOffender: any): Observable<any> {
    return of({
      success: true,
      offender: newOffender
    });
  }
}
