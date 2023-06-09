import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {environment} from "../../environments/environment";
import {ToastrService} from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router, private toastr: ToastrService) {
  }

  // try to log in a user
  public login(username: string, key: string) {
    this.http.post(environment.url + 'login', {username: username, key: key}).subscribe({
      next: (data: any) => {
        this.toastr.success('Connexion réussie. Redirection...');
        this.setLoggedIn(username, data.id, data.admin);
        setTimeout(() => {
          this.toastr.clear();
          this.router.navigate(['/']);
        }, 1000);
      },
      error: (error: any) => {
        this.toastr.error(error.error.message);
      }
    });
  }

  // logout the current user
  public logout() {
    localStorage.clear();
    this.router.navigate(['/login']).then();
  }

  // check localStorage for the login status
  public getLoggedIn() {
    const sessionStatus = localStorage.getItem('loggedIn');
    return (sessionStatus ? JSON.parse(sessionStatus) : null);
  }

  // set the login status in localStorage
  public setLoggedIn(username = '', userId = 0, admin = false) {
    localStorage.setItem('loggedIn', JSON.stringify({username: username, userId: userId, admin: admin}));
  }

}
