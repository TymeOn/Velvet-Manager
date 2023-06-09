import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {environment} from "../../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {ToastrService} from "ngx-toastr";
import {BaseChartDirective} from "ng2-charts";
import {ChartConfiguration, ChartData} from "chart.js";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";


@Component({
  selector: 'app-character',
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.css']
})
export class CharacterComponent implements OnChanges {
  @Input() character: any;
  @Input() persona: any;
  @Input() day: any;

  helpHovered = false;

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  public radarChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        min: 0,
        max: 5,
        beginAtZero: true,
        ticks: {
          display: false
        }
      }
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };
  public radarChartData: ChartData<'radar'> = {datasets: [], labels: []};

  constructor(private http: HttpClient, private toastr: ToastrService, private modalService: NgbModal) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.character) {
      this.radarChartData = {
        labels: ['ATH', 'MAI', 'COU', 'CON', 'CHA'],
        datasets: [
          {data: [this.character.ath, this.character.pro, this.character.gut, this.character.kno, this.character.cha]}
        ]
      }
    }
  }

  // updates a character
  updateCharacter() {
    this.http.put(environment.url + 'character/' + this.character.id, this.character).subscribe((data) => {
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

  getArcanaValue(value: string) {
    let arcana = '';
    switch(value) {
      case 'fool' :
        arcana = 'Le Mat';
        break;
      case 'magician' :
        arcana = 'Le Bateleur';
        break;
      case 'priestess' :
        arcana = 'La Papesse';
        break;
      case 'empress' :
        arcana = 'L\'Impératrice';
        break;
      case 'emperor' :
        arcana = 'L\'Empereur';
        break;
      case 'hierophant' :
        arcana = 'Le Pape';
        break;
      case 'lovers' :
        arcana = 'L\'Amoureux';
        break;
      case 'chariot' :
        arcana = 'Le Chariot';
        break;
      case 'justice' :
        arcana = 'La Justice';
        break;
      case 'hermit' :
        arcana = 'L\'Hermite';
        break;
      case 'fortune' :
        arcana = 'La Roue de Fortune';
        break;
      case 'strength' :
        arcana = 'La Force';
        break;
      case 'hanged' :
        arcana = 'Le Pendu';
        break;
      case 'death' :
        arcana = 'La Mort';
        break;
      case 'temperance' :
        arcana = 'Tempérance';
        break;
      case 'devil' :
        arcana = 'Le Diable';
        break;
      case 'tower' :
        arcana = 'La Maison Dieu';
        break;
      case 'star' :
        arcana = 'L\'Étoile';
        break;
      case 'moon' :
        arcana = 'La Lune';
        break;
      case 'sun' :
        arcana = 'Le Soleil';
        break;
      case 'judgement' :
        arcana = 'Le Jugement';
        break;
      case 'world' :
        arcana = 'Le Monde';
        break;
    }

    return arcana;
  }

}
