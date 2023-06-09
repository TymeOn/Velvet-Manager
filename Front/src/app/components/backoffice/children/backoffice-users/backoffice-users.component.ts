import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../../environments/environment";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-backoffice-users',
  templateUrl: './backoffice-users.component.html',
  styleUrls: ['./backoffice-users.component.css']
})
export class BackofficeUsersComponent implements OnInit {

  // The user list and full list (to reset a search)
  userList: any = [];
  fullUserList: any = [];

  // The template and current marker (for creation and update)
  userTemplate = {
    id: 0,
    username: '',
    key: '',
  }
  currentUser = JSON.parse(JSON.stringify(this.userTemplate));
  currentKey = '';

  constructor(private http: HttpClient, private modalService: NgbModal) {
  }

  ngOnInit(): void {
    this.refreshUsers();
  }

  // setting the current user
  setCurrentUser(template: any) {
    this.currentUser = JSON.parse(JSON.stringify(template));
  }

  // get all the users
  refreshUsers() {
    this.http.get(environment.url + 'users').subscribe(data => {
      this.userList = data;
      this.fullUserList = data;
    });
  }

  // create a new user
  createUser(user: any) {
    this.http.post(environment.url + 'users', {
      username: user.username,
      key: this.currentKey,
      admin: false
    }).subscribe(() => {
      this.currentKey = '';
      this.modalService.dismissAll();
      this.refreshUsers();
    });
  }

  // update a user
  updateUser(user: any) {
    this.http.put(environment.url + 'users/' + user.id, {
      username: user.username,
      key: this.currentKey,
      admin: false
    }).subscribe(() => {
      this.currentKey = '';
      this.modalService.dismissAll();
      this.refreshUsers();
    });
  }

  // delete a user
  deleteUser(user: any) {
    this.http.delete(environment.url + 'users/' + user.id).subscribe(() => {
      this.modalService.dismissAll();
      this.refreshUsers();
    });
  }

  // open a modal
  openModal(content: any) {
    this.modalService.open(content).result.then(() => {}, ()=>{});
  }

  // search and filter the user list
  search(text: string) {
    const term = text.toLowerCase();

    if (term == '') {
      this.resetSearch();
    } else {
      this.userList = this.fullUserList.filter((user: any) => {
        return (
          (user.username && user.username.toLowerCase().includes(term))
        );
      });
    }
  }

  // reset a search
  resetSearch() {
    this.userList = this.fullUserList;
  }

}
