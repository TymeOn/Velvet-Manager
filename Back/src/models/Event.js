export class Event {
    
    constructor(_id, _startDate, _endDate, _title, _color, _hidden) {
        this.id = _id;
        this.startDate = _startDate;
        this.endDate = _endDate;
        this.title = _title;
        this.color = _color;
        this.hidden = _hidden;
    }

    // getters
    getId() {return this.id;}
    getStartDate() {return this.startDate;}
    getEndDate() {return this.endDate;}
    getTitle() {return this.title;}
    getColor() {return this.color;}
    isHidden() {return this.hidden;}

    // setters
    setId(_id) {this.id = _id;}
    setStartDate(_startDate) {this.startDate = _startDate;}
    setEndDate(_endDate) {this.endDate = _endDate;}
    setTitle(_title) {this.title = _title;}
    setColor(_color) {this.color = _color;}
    setHidden(_hidden) {this.hidden = _hidden;}

}
