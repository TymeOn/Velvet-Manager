import {Component, Input} from '@angular/core';
import {format} from "date-fns";
import {fr} from "date-fns/locale";
import {environment} from "../../../../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.css']
})
export class DayComponent {
  @Input() day: any;
  @Input() admin: any;

  constructor(private http: HttpClient) {
  }

  // format a date in 'dd/MM'
  formatDate(date: string) {
    return date !== null ? format(new Date(date + 'T00:00:00'), 'dd/MM') : '';
  }

  // format a date in 'dd/MM'
  formatDay(date: string) {
    return date !== null ? format(new Date(date + 'T00:00:00'), 'eee', {locale: fr}).toUpperCase() : '';
  }

  // get the timeslot
  getTimeslot(timeslot: string) {
    switch(timeslot){
      case 'day': return 'Journée';
      case 'night': return 'Soirée';
      default: return '???';
    }
  }

  // move the day forward by one day
  moveDayForward() {
    this.http.get(environment.url + 'day-move-forward').subscribe();
  }

  // move the day backward by one day
  moveDayBackward() {
    this.http.get(environment.url + 'day-move-backward').subscribe();
  }

  // advances the timeslot
  progressTimeslot() {
    this.day.timeslot = (this.day.timeslot == 'day' ? 'night' : 'day');
    this.updateDay();
  }

  // update the timeslot
  updateDay() {
    this.http.put(environment.url + 'day', this.day).subscribe();
  }

  // get the color classes for the badge
  getBadgeColorClass() {
    let colorClass = 'bg-secondary';
    const dayName = this.formatDay(this.day.date);

    if (dayName === 'SAM.') {
      colorClass = 'bg-primary';
    } else if (dayName === 'DIM.') {
      colorClass = 'bg-danger';
    }

    return colorClass;
  }

}
