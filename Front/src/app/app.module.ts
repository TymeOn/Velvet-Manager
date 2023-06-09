import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {MapComponent} from './components/dashboard/children/map/map.component';
import {HttpClientModule} from "@angular/common/http";
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {DayComponent} from './components/dashboard/children/day/day.component';
import {WeatherComponent} from './components/dashboard/children/weather/weather.component';
import {EventComponent} from './components/dashboard/children/event/event.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {BackofficeComponent} from './components/backoffice/backoffice.component';
import {BackofficeMarkersComponent} from './components/backoffice/children/backoffice-markers/backoffice-markers.component';
import {FormsModule} from "@angular/forms";
import {BackofficeEventsComponent} from './components/backoffice/children/backoffice-events/backoffice-events.component';
import {BackofficeDayComponent} from './components/backoffice/children/backoffice-day/backoffice-day.component';
import {BackofficeWeathersComponent} from './components/backoffice/children/backoffice-weathers/backoffice-weathers.component';
import {SocketIoModule} from 'ngx-socket-io';
import {environment} from "../environments/environment";
import {FullCalendarModule} from '@fullcalendar/angular';
import {CalendarComponent} from './components/dashboard/children/calendar/calendar.component';
import {LoginComponent} from './components/login/login.component';
import {DiceComponent} from './components/dashboard/children/dice/dice.component';
import {ToastrModule} from 'ngx-toastr';
import {ConfidantComponent} from './components/dashboard/children/confidant/confidant.component';
import {BackofficeUsersComponent} from './components/backoffice/children/backoffice-users/backoffice-users.component';
import {PersonaComponent} from './components/dashboard/children/persona/persona.component';
import {NgChartsModule} from 'ng2-charts';
import { InventoryComponent } from './components/dashboard/children/inventory/inventory.component';
import { CharacterComponent } from './components/dashboard/children/character/character.component';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    DashboardComponent,
    DayComponent,
    WeatherComponent,
    EventComponent,
    BackofficeComponent,
    BackofficeMarkersComponent,
    BackofficeEventsComponent,
    BackofficeDayComponent,
    BackofficeWeathersComponent,
    CalendarComponent,
    LoginComponent,
    DiceComponent,
    ConfidantComponent,
    BackofficeUsersComponent,
    PersonaComponent,
    InventoryComponent,
    CharacterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgbModule,
    FormsModule,
    SocketIoModule.forRoot({url: environment.url, options: {}}),
    FullCalendarModule,
    ToastrModule.forRoot(),
    NgChartsModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
