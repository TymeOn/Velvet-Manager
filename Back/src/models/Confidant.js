export class Confidant {

    constructor(_id, _arcana, _name, _lvl, _exp, _user) {
        this.id = _id;
        this.arcana = _arcana;
        this.name = _name;
        this.lvl = _lvl;
        this.exp = _exp;
        this.user = _user;
    }

    // getters
    getId() { return this.id; }
    getArcana() { return this.arcana; }
    getName() { return this.name; }
    getLvl() { return this.lvl; }
    getExp() { return this.exp; }
    getUser() { return this.user; }

    // setters
    setId(_id) { this.id = _id; }
    setArcana(_arcana) { this.arcana = _arcana; }
    setName(_name) { this.name = _name; }
    setLvl(_lvl) { this.lvl = _lvl; }
    setExp(_exp) { this.exp = _exp; }
    setUser(_user) { this.user = _user; }

}
