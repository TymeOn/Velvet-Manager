import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../../environments/environment";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import { format } from 'date-fns'

@Component({
  selector: 'app-backoffice-events',
  templateUrl: './backoffice-events.component.html',
  styleUrls: ['./backoffice-events.component.css']
})
export class BackofficeEventsComponent implements OnInit {

  // The event list and full list (to reset a search)
  eventList: any = [];
  fullEventList: any = [];

  // The template and current event (for creation and update)
  eventTemplate = {
    id: 0,
    startDate: null,
    endDate: null,
    title: null,
    color: '#000000',
    hidden: true
  }
  currentEvent = JSON.parse(JSON.stringify(this.eventTemplate));

  ongoingSelector = true;

  constructor(private http: HttpClient, private modalService: NgbModal) {
  }

  ngOnInit(): void {
    this.refreshEvents();
  }

  // setting the current weather
  setCurrentEvent(template: any) {
    this.currentEvent = JSON.parse(JSON.stringify(template));
  }

  // get all the events
  refreshEvents() {
    let url = this.ongoingSelector ? 'events-ongoing?showAll=true' : 'events?showAll=true';
    this.http.get(environment.url + url).subscribe(data => {
      this.eventList = data;
      this.fullEventList = data;
    });
  }

  // create a new event
  createEvent(event: any) {
    this.http.post(environment.url + 'events', {
      startDate: (event.startDate > '' ? event.startDate : null),
      endDate: (event.endDate > '' ? event.endDate : null),
      title: event.title,
      color: event.color,
      hidden: event.hidden
    }).subscribe(() => {
      this.modalService.dismissAll();
      this.refreshEvents();
    });
  }

  // update an event
  updateEvent(event: any) {
    this.http.put(environment.url + 'events/' + event.id, {
      startDate: (event.startDate > '' ? event.startDate : null),
      endDate: (event.endDate > '' ? event.endDate : null),
      title: event.title,
      color: event.color,
      hidden: event.hidden
    }).subscribe(() => {
      this.modalService.dismissAll();
      this.refreshEvents();
    });
  }

  // delete an event
  deleteEvent(event: any) {
    this.http.delete(environment.url + 'events/' + event.id).subscribe(() => {
      this.modalService.dismissAll();
      this.refreshEvents();
    });
  }

  // open a modal
  openModal(content: any) {
    this.modalService.open(content).result.then(() => {}, ()=>{});
  }

  // search and filter the weather list
  search(text: string) {
    const term = text.toLowerCase();

    if (term == '') {
      this.resetSearch();
    } else {
      this.eventList = this.fullEventList.filter((event: any) => {
        return (
          (
            event.startDate &&
            format(new Date(event.startDate + 'T00:00:00'), 'dd/MM/yyyy').includes(term)
          ) ||
          (
            event.endDate &&
            format(new Date(event.endDate + 'T00:00:00'), 'dd/MM/yyyy').includes(term)
          ) ||
          (event.title && event.title.toLowerCase().includes(term)) ||
          (event.color && event.color.toLowerCase().includes(term))
        );
      });
    }
  }

  // reset a search
  resetSearch() {
    this.eventList = this.fullEventList;
  }

  // format a date in 'yyyy-MM-dd'
  formatDate(date: string) {
    return date !== null ? format(new Date(date + 'T00:00:00'), 'yyyy-MM-dd') : '';
  }

}
