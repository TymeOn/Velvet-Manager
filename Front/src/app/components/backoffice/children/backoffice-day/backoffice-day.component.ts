import {Component, OnInit} from '@angular/core';
import {environment} from "../../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {format} from "date-fns";
import {formatDate} from "@angular/common";

@Component({
  selector: 'app-backoffice-day',
  templateUrl: './backoffice-day.component.html',
  styleUrls: ['./backoffice-day.component.css']
})
export class BackofficeDayComponent implements OnInit {

  // the current day
  day: any = {
    id: 1,
    date: null,
    timeslot: 'day'
  };

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    this.refreshDay();
  }

  // get the current day
  refreshDay() {
    this.http.get(environment.url + 'day').subscribe(data => {
      this.day = data;
    });
  }

  // update the day
  updateDay() {
    this.http.put(environment.url + 'day', {
      date: (this.day.date > '' ? this.day.date : null),
      timeslot: this.day.timeslot,
    }).subscribe(() => {
      this.refreshDay();
    });
  }

  // move the day forward by one day
  moveDayForward() {
    this.http.get(environment.url + 'day-move-forward').subscribe(data => {
      this.day = data;
      this.refreshDay();
    });
  }

  // move the day backward by one day
  moveDayBackward() {
    this.http.get(environment.url + 'day-move-backward').subscribe(data => {
      this.day = data;
      this.refreshDay();
    });
  }

  // format a date in 'yyyy-MM-dd'
  formatDate(date: string) {
    return date !== null ? format(new Date(date + 'T00:00:00'), 'yyyy-MM-dd') : '';
  }

}
