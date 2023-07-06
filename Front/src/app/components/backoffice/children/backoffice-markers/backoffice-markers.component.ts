import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../../environments/environment";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-backoffice-markers',
  templateUrl: './backoffice-markers.component.html',
  styleUrls: ['./backoffice-markers.component.css']
})
export class BackofficeMarkersComponent implements OnInit {

  // The marker list and full list (to reset a search)
  markerList: any = [];
  fullMarkerList: any = [];

  // The template and current marker (for creation and update)
  markerTemplate = {
    id: 0,
    label: null,
    lat: null,
    lon: null,
    icon: null,
    bgColor: '#000000',
    hidden: true
  }
  currentMarker = JSON.parse(JSON.stringify(this.markerTemplate));

  // search value
  searchValue = '';

  constructor(private http: HttpClient, private modalService: NgbModal) {
  }

  ngOnInit(): void {
    this.refreshMarkers();
  }

  // setting the current marker
  setCurrentMarker(template: any) {
    this.currentMarker = JSON.parse(JSON.stringify(template));
  }

  // get all the markers
  refreshMarkers() {
    this.http.get(environment.url + 'markers?showAll=true').subscribe(data => {
      this.markerList = data;
      this.fullMarkerList = data;
      this.search();
    });
  }

  // create a new marker
  createMarker(marker: any) {
    this.http.post(environment.url + 'markers', {
      label: marker.label,
      lat: marker.lat,
      lon: marker.lon,
      icon: marker.icon,
      bgColor: marker.bgColor,
      hidden: marker.hidden
    }).subscribe(() => {
      this.modalService.dismissAll();
      this.refreshMarkers();
    });
  }

  // update a marker
  updateMarker(marker: any) {
    this.http.put(environment.url + 'markers/' + marker.id, {
      label: marker.label,
      lat: marker.lat,
      lon: marker.lon,
      icon: marker.icon,
      bgColor: marker.bgColor,
      hidden: marker.hidden
    }).subscribe(() => {
      this.modalService.dismissAll();
      this.refreshMarkers();
    });
  }

  // delete a marker
  deleteMarker(marker: any) {
    this.http.delete(environment.url + 'markers/' + marker.id).subscribe(() => {
      this.modalService.dismissAll();
      this.refreshMarkers();
    });
  }

  // open a modal
  openModal(content: any) {
    this.modalService.open(content).result.then(() => {}, ()=>{});
  }

  // search and filter the marker list
  search() {
    const term = this.searchValue.toLowerCase();

    if (term == '') {
      this.resetSearch();
    } else {
      this.markerList = this.fullMarkerList.filter((marker: any) => {
        return (
          (marker.label && marker.label.toLowerCase().includes(term)) ||
          (marker.lat && marker.lat.toString().includes(term)) ||
          (marker.lon && marker.lon.toString().includes(term)) ||
          (marker.icon && marker.icon.toLowerCase().includes(term)) ||
          (marker.bgColor && marker.bgColor.toLowerCase().includes(term))
        );
      });
    }
  }

  // reset a search
  resetSearch() {
    this.markerList = this.fullMarkerList;
  }

}
