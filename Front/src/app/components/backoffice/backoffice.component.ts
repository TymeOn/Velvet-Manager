import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";


@Component({
  selector: 'app-backoffice',
  templateUrl: './backoffice.component.html',
  styleUrls: ['./backoffice.component.css']
})
export class BackofficeComponent implements OnInit {

  constructor(public auth: AuthService, private router: Router) {
  }

  ngOnInit(): void {
    let loggedIn = this.auth.getLoggedIn();

    if (!loggedIn || !loggedIn.admin) {
      this.router.navigate(['/']);
    }
  }

}
