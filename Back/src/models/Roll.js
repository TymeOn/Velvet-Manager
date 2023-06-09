export class Roll {

    constructor(_id, _type, _value, _detail, _timestamp, _user) {
        this.id = _id;
        this.type = _type;
        this.value = _value;
        this.detail = _detail;
        this.timestamp = _timestamp;
        this.user = _user;
    }

    // getters
    getId() { return this.id; }
    getType() { return this.type; }
    getValue() { return this.value; }
    getDetail() { return this.detail; }
    getTimestamp() { return this.timestamp; }
    getUser() { return this.user; }

    // setters
    setId(_id) { this.id = _id; }
    setType(_type) { this.type = _type; }
    setValue(_value) { this.value = _value; }
    setDetail(_detail) { this.detail = _detail; }
    setTimestamp(_timestamp) { this.timestamp = _timestamp; }
    setUser(_user) { this.user = _user; }

}
