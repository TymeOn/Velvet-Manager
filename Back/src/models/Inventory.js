export class Inventory {

    constructor(_id, _items, _notes, _user) {
        this.id = _id;
        this.items = _items;
        this.notes = _notes;
        this.user = _user;
    }

    // getters
    getId() { return this.id; }
    getItems() { return this.items; }
    getNotes() { return this.notes; }
    getUser() { return this.user; }

    // setters
    setId(_id) { this.id = _id; }
    setItems(_items) { this.items = _items; }
    setNotes(_notes) { this.notes = _notes; }
    setUser(_user) { this.user = _user; }

}
