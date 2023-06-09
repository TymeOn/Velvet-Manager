import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username = '';
  key = '';
  coverImgSrc = environment.coverImgSrc;

  constructor(private auth: AuthService, private router: Router) {
  }

  ngOnInit(): void {
    let loggedIn = this.auth.getLoggedIn();

    if (loggedIn) {
      this.router.navigate(['/']);
    }
  }

    // attempt to login
  login() {
    this.auth.login(this.username, this.key);
  }

}
