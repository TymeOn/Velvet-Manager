export class Weather {

    constructor(_date, _code, _temperature) {
        this.date = _date;
        this.code = _code;
        this.temperature = _temperature;
    }

    // getters
    getDate() { return this.date; }
    getCode() { return this.code; }
    getTemperature() { return this.temperature; }

    // setters
    setDate(_date) { this.date = _date; }
    setCode(_code) { this.code = _code; }
    setTemperature(_temperature) { this.temperature = _temperature; }

}
