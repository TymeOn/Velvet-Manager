import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent {
  @Input() events: any;
  @Input() day: any;

  // get the color classes for the cards
  getBorderColorClass() {
    let colorClass = 'border-day';
    const timeslot = this.day.timeslot;
    const mirror = this.day.mirror;

    if (timeslot == 'night' && !mirror) {
      colorClass = 'border-night';
    } else if (mirror) {
      colorClass = 'border-mirror';
    }

    return colorClass;
  }
}
