import {Component, Input} from '@angular/core';
import {environment} from "../../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-confidant',
  templateUrl: './confidant.component.html',
  styleUrls: ['./confidant.component.css']
})
export class ConfidantComponent {
  @Input() confidants: any;
  @Input() day: any;
  helpHovered = false;

  constructor(private http: HttpClient, private toastr: ToastrService) {
  }

  // updates a confidant
  updateConfidant() {
    this.http.put(environment.url + 'confidants/' + this.confidants.id, this.confidants).subscribe((data) => {
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

  // get the popover color classes
  getPopoverColorClass() {
    let colorClass = 'border border-secondary';
    const timeslot = this.day.timeslot;
    const mirror = this.day.mirror;

    if (timeslot == 'night' && !mirror) {
      colorClass = 'border border-white bg-dark';
    } else if (mirror) {
      colorClass = 'border border-mirror bg-mirror';
    }

    return colorClass;
  }

  // get the text color classes
  getTextColorClass() {
    let colorClass = '';
    const timeslot = this.day.timeslot;
    const mirror = this.day.mirror;

    if (timeslot == 'night' && !mirror) {
      colorClass = 'text-white';
    } else if (mirror) {
      colorClass = 'text-mirror';0
    }

    return colorClass;
  }

}
