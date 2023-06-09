import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Socket} from "ngx-socket-io";
import {addDays} from "date-fns";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  // data
  day = {
    id: 1,
    date: '2023-01-01',
    timeslot: 'day',
    mirror: false
  };
  weather = {};
  markers: any[] = [];
  currentEvents: any[] = [];
  events: any[] = [];
  rolls: any;
  confidants: any;
  persona: any;
  inventory: any;
  character: any;

  userId: number = 0;
  originalUserId: number = 0;
  admin: boolean = false;


  constructor(private http: HttpClient, private socket: Socket) {
    this.socket.fromEvent('markers-updated').subscribe(() => {
      this.fetchMarkers();
    });

    this.socket.fromEvent('day-updated').subscribe(() => {
      this.fetchDay();
      this.fetchWeather();
      this.fetchCurrentEvents();
    });

    this.socket.fromEvent('events-updated').subscribe(() => {
      this.fetchCurrentEvents();
      this.fetchEvents();
    });

    this.socket.fromEvent('rolls-updated').subscribe(() => {
      this.fetchRolls();
    });

    this.socket.fromEvent('confidants-updated').subscribe((userId) => {
      if (!this.admin || (this.admin && (this.userId == userId))) {
        this.fetchConfidants();
      }
    });

    this.socket.fromEvent('persona-updated').subscribe((userId) => {
      if (!this.admin || (this.admin && (this.userId == userId))) {
        this.fetchPersona();
      }
    });

    this.socket.fromEvent('inventory-updated').subscribe((userId) => {
      if (!this.admin || (this.admin && (this.userId == userId))) {
        this.fetchInventory();
      }
    });

    this.socket.fromEvent('character-updated').subscribe((userId) => {
      if (!this.admin || (this.admin && (this.userId == userId))) {
        this.fetchCharacter();
      }
    });
  }

  // fetch all the data
  fetchAll() {
    this.fetchDay();
    this.fetchWeather();
    this.fetchCurrentEvents();
    this.fetchMarkers();
    this.fetchEvents();
    this.fetchRolls();
    this.fetchConfidants();
    this.fetchPersona();
    this.fetchInventory();
    this.fetchCharacter();
  }

  // fetch the current day
  fetchDay() {
    this.http.get(environment.url + 'day').subscribe((data: any) => {
      this.day = data;
    });
  }

  // fetch the current weather
  fetchWeather() {
    this.http.get(environment.url + 'weathers-current').subscribe(data => {
      this.weather = data;
    });
  }

  // fetch the current events
  fetchCurrentEvents() {
    let url = this.admin ? 'events-current?showAll=true' : 'events-current';
    this.http.get(environment.url + url).subscribe((data :any) => {
      this.currentEvents = data;
    });
  }

  // fetch the events
  fetchEvents() {
    let url = this.admin ? 'events?showAll=true' : 'events';
    this.http.get(environment.url + url).subscribe((data :any) => {
      this.events = [];
      data.forEach((datum:any) => {
        this.events.push({
          title: datum.title,
          start: datum.startDate,
          end: addDays(new Date(datum.endDate), 1),
          color: datum.color,
          borderColor: datum.hidden ? 'red' : '',
          allDay: true
        });
      });
    });
  }

  // fetch the current markers
  fetchMarkers() {
    let url = this.admin ? 'markers?showAll=true' : 'markers';
    this.http.get(environment.url + url).subscribe((data: any) => {
      this.markers = data;
    });
  }

  // fetch the latest rolls
  fetchRolls() {
    this.http.get(environment.url + 'rolls-latest').subscribe(data => {
      this.rolls = data;
    });
  }

  // fetch the confidants for the user currently logged in
  fetchConfidants() {
    if (!this.admin || (this.admin && (this.userId != this.originalUserId))) {
      this.http.get(environment.url + 'confidants-from-user/' + this.userId).subscribe(data => {
        this.confidants = data;
      });
    }
  }

  // fetch the persona for the user currently logged in
  fetchPersona() {
    if (!this.admin || (this.admin && (this.userId != this.originalUserId))) {
      this.http.get(environment.url + 'persona-from-user/' + this.userId).subscribe(data => {
        this.persona = data;
      });
    }
  }

  // fetch the inventory for the user currently logged in
  fetchInventory() {
    if (!this.admin || (this.admin && (this.userId != this.originalUserId))) {
      this.http.get(environment.url + 'inventory-from-user/' + this.userId).subscribe(data => {
        this.inventory = data;
      });
    }
  }

  // fetch the character for the user currently logged in
  fetchCharacter() {
    if (!this.admin || (this.admin && (this.userId != this.originalUserId))) {
      this.http.get(environment.url + 'character-from-user/' + this.userId).subscribe(data => {
        this.character = data;
      });
    }
  }

  // get the current day
  getDay() {
    return this.day;
  }

  // get the current weather
  getWeather() {
    return this.weather;
  }

  // get the current events
  getCurrentEvents() {
    return this.currentEvents;
  }

  // get the markers
  getMarkers() {
    return this.markers;
  }

  // get events
  getEvents() {
    return this.events;
  }

  // get rolls
  getRolls() {
    return this.rolls;
  }

  // get confidants
  getConfidants() {
    return this.confidants;
  }

  // get persona
  getPersona() {
    return this.persona;
  }

  // get inventory
  getInventory() {
    return this.inventory;
  }

  // get character
  getCharacter() {
    return this.character;
  }

  // get the userId
  getUserId() {
    return this.userId;
  }

  // set the userId
  setUserId(userId: number) {
    this.userId = userId;
  }

  // set the original userId
  setOriginalUserId(originalUserId: number) {
    this.originalUserId = originalUserId;
  }

  // get the admin status
  getAdmin() {
    return this.admin;
  }

  // set the admin status
  setAdmin(admin: boolean) {
    this.admin = admin;
  }

}
