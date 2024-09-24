import { Component, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { MapService } from '../../services/map.service';

@Component({
  selector: 'app-map',
  standalone: true,
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnChanges {

  @Input() visibleOffenders: any[] = [];
  private map: any;
  private markersLayer: L.LayerGroup = L.layerGroup();

  constructor(private mapService: MapService) { }

  ngOnInit(): void {
    this.initMap();

    this.mapService.offenderLocation$.subscribe(location => {
      this.map.setView([location.latitude, location.longitude], 40);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visibleOffenders'] && this.visibleOffenders.length > 0) {
      this.updateMarkers();

      // Fly to the first offender in the list if coordinates are available
      const firstOffender = this.visibleOffenders[0];
      if (firstOffender.lastKnownPosition && firstOffender.lastKnownPosition.latitude && firstOffender.lastKnownPosition.longitude) {
        this.map.setView([firstOffender.lastKnownPosition.latitude, firstOffender.lastKnownPosition.longitude], 13);
      }
    }
  }

  private initMap() {
    if (this.map) {
      this.map.remove();
    }
    this.map = L.map('map').setView([40.545569, -3.647082], 40);

    const googleMapsLayer = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      attribution: 'Map data ©2024 Google'
    }).addTo(this.map);

    const googleSatelliteLayer = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      attribution: 'Imagery ©2024 TerraMetrics'
    });

    L.control.layers({
      'Default': googleMapsLayer,
      'Satellite': googleSatelliteLayer
    }).addTo(this.map);

    this.markersLayer.addTo(this.map);
  }


  private updateMarkers(): void {
    this.markersLayer.clearLayers();

    const bounds = L.latLngBounds([]);

    this.visibleOffenders.forEach(offender => {
      if (offender.lastKnownPosition && offender.lastKnownPosition.latitude && offender.lastKnownPosition.longitude) {

        // Usar el ícono predeterminado de Leaflet
        const markerIcon = L.icon({
          iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
          shadowUrl: '',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
        });

        const marker = L.marker([offender.lastKnownPosition.latitude, offender.lastKnownPosition.longitude], {
          icon: markerIcon
        }).bindPopup(`<b>${offender.firstName} ${offender.lastName}</b><br>Home: ${offender.homeLocation}`)
          .addTo(this.markersLayer);

        bounds.extend([offender.lastKnownPosition.latitude, offender.lastKnownPosition.longitude]);
      }
    });

    if (bounds.isValid()) {
      this.map.fitBounds(bounds);
    }
  }
}
