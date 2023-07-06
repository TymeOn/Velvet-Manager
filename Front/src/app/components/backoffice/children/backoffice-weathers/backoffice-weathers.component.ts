import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../../environments/environment";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import { format } from 'date-fns'

@Component({
  selector: 'app-backoffice-weathers',
  templateUrl: './backoffice-weathers.component.html',
  styleUrls: ['./backoffice-weathers.component.css']
})
export class BackofficeWeathersComponent implements OnInit {

  // The weather list and full list (to reset a search)
  weatherList: any = [];
  fullWeatherList: any = [];

  // The template and current weather (for update)
  weatherTemplate = {
    date: null,
    code: null,
    temperature: null
  }
  currentWeather = JSON.parse(JSON.stringify(this.weatherTemplate));

  // search values
  searchValue = '';
  ongoingSelector = true;

  constructor(private http: HttpClient, private modalService: NgbModal) {
  }

  ngOnInit(): void {
    this.refreshWeathers();
  }

  // setting the current weather
  setCurrentWeather(template: any) {
    this.currentWeather = JSON.parse(JSON.stringify(template));
  }

  // get all the weathers
  refreshWeathers() {
    let url = this.ongoingSelector ? 'weathers-ongoing' : 'weathers';
    this.http.get(environment.url + url).subscribe(data => {
      this.weatherList = data;
      this.fullWeatherList = data;
      this.search();
    });
  }

  // update an event
  updateWeather(weather: any) {
    this.http.put(environment.url + 'weathers/' + weather.date, {
      code: weather.code,
      temperature: weather.temperature
    }).subscribe(() => {
      this.modalService.dismissAll();
      this.refreshWeathers();
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
      this.weatherList = this.fullWeatherList.filter((weather: any) => {
        return (
          (
            weather.date &&
            format(new Date(weather.date + 'T00:00:00'), 'dd/MM/yyyy').includes(term)
          ) ||
          (weather.code && weather.code.toLowerCase().includes(term)) ||
          (weather.temperature && weather.temperature.toString().includes(term))
        );
      });
    }
  }

  // reset a search
  resetSearch() {
    this.weatherList = this.fullWeatherList;
  }

  // format a date in 'yyyy-MM-dd'
  formatDate(date: string) {
    return date !== null ? format(new Date(date + 'T00:00:00'), 'yyyy-MM-dd') : '';
  }

  getWeatherIcon(code: string) {
    switch(code){
      case 'clear': return 'sun';
      case 'clear-cloudy': return 'cloud-sun';
      case 'cloudy': return 'cloud';
      case 'rainy': return 'cloud-showers-heavy';
      case 'snowy': return 'snowflake';
      default: return 'question';
    }
  }

  getWeatherLabel(code: string) {
    switch(code){
      case 'clear': return 'Ensoleillé';
      case 'clear-cloudy': return 'Mitigé';
      case 'cloudy': return 'Nuageux';
      case 'rainy': return 'Pluvieux';
      case 'snowy': return 'Enneigé';
      default: return 'Inconnu';
    }
  }

}
