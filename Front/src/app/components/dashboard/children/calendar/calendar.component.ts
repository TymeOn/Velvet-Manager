import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {CalendarOptions} from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import frLocale from '@fullcalendar/core/locales/fr';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnChanges {
  @Input() events: any;
  @Input() day: any;

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin],
    now: new Date(),
    headerToolbar: {
      start: 'prev next today',
      center: 'title',
      end: '',
    },
    locale: frLocale,
  };

  ngOnChanges(changes: SimpleChanges): void {
    this.calendarOptions.now = this.day.date;
  }

}
