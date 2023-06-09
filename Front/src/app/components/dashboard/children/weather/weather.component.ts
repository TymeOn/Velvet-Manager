import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent {
  @Input() weather: any;
  @Input() timeslot: any;

  getWeatherIcon(code: string) {
    switch(code) {
      case 'clear': return (this.timeslot == 'day' ? 'sun' : 'moon');
      case 'clear-cloudy': return (this.timeslot == 'day' ? 'cloud-sun' : 'cloud-moon');
      case 'cloudy': return 'cloud';
      case 'rainy': return 'cloud-showers-heavy';
      case 'snowy': return 'snowflake';
      default: return 'question';
    }
  }

}
