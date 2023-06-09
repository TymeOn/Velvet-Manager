import {AfterViewInit, Component, Input, OnChanges} from '@angular/core';
import 'leaflet';
import 'beautifymarker';
declare let L: any;
import {DataService} from "../../../../services/data.service";
import {environment} from "../../../../../environments/environment";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit, OnChanges {
  @Input() markers: any;
  @Input() day: any;

  private map: any;
  private markerLayer: any;
  private southWest = L.latLng(environment.southWestLat, environment.southWestLng);
  private northEast = L.latLng(environment.northEastLat, environment.northEastLng);
  private bounds = L.latLngBounds(this.southWest, this.northEast);

  constructor() { }

  ngAfterViewInit(): void {
    this.map = L.map('map', {
      center: [ environment.centerLat, environment.centerLng ],
      maxBounds: this.bounds,
      zoom: environment.defaultZoom,
      minZoom: environment.minZoom,
      maxBoundsViscosity: 1,
      attributionControl: false
    });

    const tiles = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: environment.maxZoom,
      minZoom: environment.minZoom,
    });

    tiles.addTo(this.map);
    this.markerLayer = L.layerGroup().addTo(this.map);
  }

  ngOnChanges(): void {
    if (this.markerLayer) {
      this.markerLayer.clearLayers();
      for (const m of this.markers) {
        const marker = L.marker([m.lat, m.lon], {icon: L.BeautifyIcon.icon(
            {
              icon: m.icon,
              iconShape: 'marker',
              backgroundColor: m.bgColor,
              borderColor: '#D4D4D4',
              textColor: '#E5E5E5',
              borderStyle: m.hidden ? 'dashed' : 'solid'
            }
          )});
        marker.addTo(this.markerLayer).bindPopup(m.label);
      }
    }
  }

  // get the color classes for the cards
  getMapColorClass() {
    let colorClass = 'day-map';
    const timeslot = this.day.timeslot;
    const mirror = this.day.mirror;

    if (timeslot == 'night' && !mirror) {
      colorClass = 'night-map';
    } else if (mirror) {
      colorClass = 'mirror-map';
    }

    return colorClass;
  }

}
