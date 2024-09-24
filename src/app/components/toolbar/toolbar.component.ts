import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import moment from 'moment-timezone';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { MenuModule } from 'primeng/menu';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PanelModule } from 'primeng/panel';
import { ToolbarModule } from 'primeng/toolbar';
import { TimezonePipe } from '../../pipes/timezone.pipe';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [
    CommonModule, ButtonModule,
    PanelModule, ToolbarModule,
    AvatarModule, MenuModule,
    FormsModule, TimezonePipe,
    DropdownModule, OverlayPanelModule
  ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css'
})
export class ToolbarComponent implements OnInit, OnDestroy {
  currentTime: string = '';
  selectedTimezone: string = 'UTC';
  timezonesDropdown: any[] = [];
  intervalId: any;

  ngOnInit(): void {
     // Fill dropdown with timezones
    this.timezonesDropdown = moment.tz.names().map(tz => ({
      label: tz,
      value: tz
    }));

    // Initialize current time
    this.updateTime();

    // Update time every second
    this.intervalId = setInterval(() => {
      this.updateTime();
    }, 1000);  // cada 1 segundo
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  updateTime(): void {
    this.currentTime = moment().tz(this.selectedTimezone).format('YYYY-MM-DD HH:mm:ss');
  }

  changeTimezone(timezone: string): void {
    this.selectedTimezone = timezone;
    this.updateTime();
  }
}
