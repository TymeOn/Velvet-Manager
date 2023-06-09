import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {environment} from "../../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {ToastrService} from "ngx-toastr";
import {BaseChartDirective} from "ng2-charts";
import {ChartConfiguration, ChartData, ChartType} from "chart.js";
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule} from "@angular/forms";
import {NgClass} from "@angular/common";


@Component({
  selector: 'app-persona',
  templateUrl: './persona.component.html',
  styleUrls: ['./persona.component.css']
})
export class PersonaComponent implements OnChanges {
  @Input() persona: any;
  @Input() day: any;

  helpHovered = false;
  effectsHovered = [].constructor(20).fill(false);
  currentEffect = '';

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        min: 0,
        max: 5,
        display: false,
        ticks: {
          display: false,
        }
      },
      y: {
        min: 0,
        max: 5,
        display: false,
      }
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };
  public barChartData: ChartData<'bar'> = {datasets: [], labels: []};

  constructor(private http: HttpClient, private toastr: ToastrService, private modalService: NgbModal) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.persona) {
      this.barChartData = {
        labels: ['FOR', 'MAG', 'END', 'AGI', 'LUC'],
        datasets: [
          {data: [this.persona.str, this.persona.mag, this.persona.end, this.persona.agi, this.persona.luc]}
        ]
      }
    }
  }

  // updates a persona
  updatePersona() {
    this.http.put(environment.url + 'persona/' + this.persona.id, this.persona).subscribe((data) => {
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
    let colorClass = 'border border-secondary rounded';
    const timeslot = this.day.timeslot;
    const mirror = this.day.mirror;

    if (timeslot == 'night' && !mirror) {
      colorClass = 'border border-white bg-dark rounded text-white';
    } else if (mirror) {
      colorClass = 'border border-mirror bg-mirror rounded text-mirror';
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
      colorClass = 'text-mirror';
    }

    return colorClass;
  }

  openSkillEffectModal(id: number) {
    const modalRef = this.modalService.open(SkillEffectModalContent);
    modalRef.componentInstance.day = this.day;
    modalRef.componentInstance.skillEffect = this.persona.skillEffects[id];
    modalRef.componentInstance.saved.subscribe((value: string) => {
      this.persona.skillEffects[id] = value;
    });
  }

}



@Component({
  selector: 'skill-effect-modal-content',
  standalone: true,
  styles:  [`.mirror { background: #413543; color: #efeda6;}`],
  template: `
    <div [ngClass]="getCardColorClass()">
      <div class="modal-header">
        <h4 class="modal-title">Détail de la capacité</h4>
        <button type="button" class="btn-close" aria-label="Close" (click)="activeModal.dismiss('Cross click')"></button>
      </div>
      <div class="modal-body">
        <textarea [(ngModel)]="skillEffect" [ngClass]="getColorClass()" (change)="saved.emit(skillEffect)" class="form-control mb-3"
               placeholder="Description" rows="5"></textarea>
      </div>
      <div class="modal-footer">
        <button class="btn btn-outline-warning" (click)="activeModal.close()">Modifier</button>
      </div>
    </div>
  `,
  imports: [
    FormsModule,
    NgClass
  ]
})
export class SkillEffectModalContent {
  @Input() skillEffect: string = '';
  @Input() day: any;
  @Output() saved = new EventEmitter();
  constructor(public activeModal: NgbActiveModal) {}
  // get the color classes for the cards
  getCardColorClass() {
    let colorClass = '';
    const timeslot = this.day.timeslot;
    const mirror = this.day.mirror;

    if (timeslot == 'night' && !mirror) {
      colorClass = 'bg-dark text-white';
    } else if (mirror) {
      colorClass = 'mirror';
    }

    return colorClass;
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
