import {Component, OnInit} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {DataService} from "../../services/data.service";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit{

  username: string = '';
  userId: number = 0;
  users: any = [];

  constructor(
    public auth: AuthService,
    private router: Router,
    public dataService: DataService,
    private modalService: NgbModal,
    private http: HttpClient
  ) {
  }

  ngOnInit(): void {
    let loggedIn = this.auth.getLoggedIn();

    if (!loggedIn) {
      this.router.navigate(['/login']);
    } else {

      this.username = loggedIn.username;
      this.userId = loggedIn.userId;

      // on startup, fetch everything
      this.dataService.setUserId(loggedIn.userId);
      this.dataService.setOriginalUserId(loggedIn.userId);
      this.dataService.setAdmin(loggedIn.admin);
      this.dataService.fetchAll();

      this.http.get(environment.url + 'users').subscribe(data => this.users = data);
    }
  }

  // open a large modal
  openModal(content: any) {
    this.modalService.open(content,{ size: 'lg' }).result.then(() => {}, ()=>{});
  }

  // get the color classes for the cards
  getCardColorClass() {
    let colorClass = '';
    const timeslot = this.dataService.getDay().timeslot;
    const mirror = this.dataService.getDay().mirror;

    if (timeslot == 'night' && !mirror) {
      colorClass = 'bg-dark text-white';
    } else if (mirror) {
      colorClass = 'mirror';
    }

    return colorClass;
  }

  // get the color classes for the nav tabs
  getNavColorClass() {
    let colorClass = 'nav-day';
    const timeslot = this.dataService.getDay().timeslot;
    const mirror = this.dataService.getDay().mirror;

    if (timeslot == 'night' && !mirror) {
      colorClass = 'nav-night';
    } else if (mirror) {
      colorClass = 'nav-mirror';
    }

    return colorClass;
  }

  // opens a new tab and redirect to backoffice
  redirectToBackoffice() {
    if (this.dataService.getAdmin()) {
      const url = this.router.serializeUrl(
        this.router.createUrlTree(['/backoffice'])
      );
      window.open(url, '_blank');
    }
  }

  // check if the current user is a player or is impersonating a user
  isPlayer() {
    return (!this.dataService.getAdmin() || (this.dataService.getAdmin() && (this.dataService.getUserId() != this.userId)));
  }

  reloadPlayerComponents() {
    this.dataService.fetchConfidants();
    this.dataService.fetchPersona();
    this.dataService.fetchInventory();
    this.dataService.fetchCharacter();
  }

}
