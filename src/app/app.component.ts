import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MapComponent } from "./components/map/map.component";
import { OffenderListComponent } from './components/offender-list/offender-list.component';
import { ToolbarComponent } from "./components/toolbar/toolbar.component";
import { AddOffenderComponent } from "./components/add-offender/add-offender.component";
import { OffenderService } from './services/offender.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MapComponent, OffenderListComponent, ToolbarComponent, AddOffenderComponent,],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'AdrianaRomero';
  offenders: any[] = [];

  constructor(private offenderService: OffenderService) { }

  ngOnInit(): void {
    // Load offenders from the service when the app initializes
    this.offenderService.getOffenders().subscribe((data) => {
      this.offenders = data;
    });
  }

  onOffenderAdded(newOffender: any): void {
    this.offenders = [...this.offenders, newOffender];
    console.log('Nuevo infractor añadido:', newOffender);
  }
}