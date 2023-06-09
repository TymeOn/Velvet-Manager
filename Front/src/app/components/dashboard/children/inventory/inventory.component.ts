import {Component, Input} from '@angular/core';
import {environment} from "../../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent {
  @Input() inventory: any;
  @Input() day: any;
  helpHovered = false;

  constructor(private http: HttpClient, private toastr: ToastrService) {
  }

  // updates an inventory
  updateInventory() {
    this.http.put(environment.url + 'inventory/' + this.inventory.id, this.inventory).subscribe((data) => {
      this.toastr.success('Changements enregistrés');
    });
  }

  // get the color classes
  getColorClass() {
    let colorClass = '';
    const timeslot = this.day.timeslot;
    const mirror = this.day.mirror;

    if (timeslot == 'night' && !mirror) {
      colorClass = 'bg-dark text-white';
    } else if (mirror) {
      colorClass = 'bg-mirror text-mirror';
    }

    return colorClass;
  }

}
