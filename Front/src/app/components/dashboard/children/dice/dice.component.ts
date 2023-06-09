import {Component, Input} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../../environments/environment";

@Component({
  selector: 'app-dice',
  templateUrl: './dice.component.html',
  styleUrls: ['./dice.component.css'],
})
export class DiceComponent {
  @Input() rolls: any;
  @Input() userId: number = 0;
  @Input() day: any;
  @Input() admin: any;

  nbDice = 1;
  selectedDice = 6;
  modifier = '';
  detail = '';
  result = 0;
  rolling = false;
  historyHovered = false;
  hideRoll = false;

  constructor(public http: HttpClient) {
  }

  // rolling the number of selected dices
  roll() {
    this.rolling = true;
    let timesRun = 0;
    let lastDisplay = 0;

    // starting the roll animation
    let interval = setInterval(() => {
      timesRun++;

      // if the animation is done X times, proceed to the true roll
      if(timesRun >= 10) {
        // stop the animation
        clearInterval(interval);

        // compute the real roll
        let tempResult = 0;
        this.detail = '';
        for (let i = 0; i < this.nbDice; i++) {
          let dice = this.getDiceResult(this.selectedDice);
          this.detail += dice + '+';
          tempResult += dice;
        }
        this.detail = this.detail.substring(0,  this.detail.length - 1);
        this.result = tempResult + Number(this.modifier);
        this.sendRollResult();
        this.rolling = false;
      } else {
        // fake dice roll for the animation
        let tempDisplay = -1;
        do {
          tempDisplay = this.getDiceResult(this.nbDice * this.selectedDice);
        } while(tempDisplay == lastDisplay);

        this.result = tempDisplay;
      }
    }, 75);
  }

  // get the result of one specified dice roll
  getDiceResult(max: number) {
    return (Math.floor(Math.random() * max) + 1);
  }

  // allow one roll minimal
  boundNbDice() {
    if (this.nbDice <= 0) {
      this.nbDice = 1
    }
  }

  // send the roll result
  sendRollResult() {
    this.http.post(environment.url + 'rolls', {
      type: this.hideRoll ? '■' : (this.nbDice + 'd' + this.selectedDice + (
        (this.modifier != '' || Number(this.modifier) != 0) ?
          (Number(this.modifier) > 0 ? '+' + this.modifier : this.modifier) :
        '')
      ),
      value: this.result,
      detail: this.hideRoll ? '■' : this.detail,
      timestamp: new Date(),
      user: {
        id: this.userId
      }
    }).subscribe();
    this.modifier = '';
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

}
