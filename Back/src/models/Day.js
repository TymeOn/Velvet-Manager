export class Day {

    constructor(_id, _date, _timeslot, _mirror) {
        this.id = _id;
        this.date = _date;
        this.timeslot = _timeslot;
        this.mirror = _mirror;
    }

    // getters
    getId() { return this.id; }
    getDate() { return this.date; }
    getTimeslot() { return this.timeslot; }
    isMirror() { return this.mirror; }

    // setters
    setId(_id) { this.id = _id; }
    setDate(_date) { this.date = _date; }
    setTimeslot(_timeslot) { this.timeslot = _timeslot; }
    setMirror(_mirror) { this.mirror = _mirror; }

}
