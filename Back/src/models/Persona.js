export class Persona {

    constructor(_id, _name, _arcana, _suit, _lvl, _exp, _str, _mag, _end, _agi, _luc, _affinities, _attacks, _attackTypes, _attackDamages, _skills, _skillCosts, _skillEffects, _user) {
        this.id = _id;
        this.name = _name;
        this.arcana = _arcana;
        this.suit = _suit;
        this.lvl = _lvl;
        this.exp = _exp;
        this.str = _str;
        this.mag = _mag;
        this.end = _end;
        this.agi = _agi;
        this.luc = _luc;
        this.affinities = _affinities;
        this.attacks = _attacks;
        this.attackTypes = _attackTypes;
        this.attackDamages = _attackDamages;
        this.skills = _skills;
        this.skillCosts = _skillCosts;
        this.skillEffects = _skillEffects;
        this.user = _user;
    }

    // getters
    getId() { return this.id; }
    getName() { return this.name; }
    getArcana() { return this.arcana; }
    getSuit() { return this.suit; }
    getLvl() { return this.lvl; }
    getExp() { return this.exp; }
    getStr() { return this.str; }
    getMag() { return this.mag; }
    getEnd() { return this.end; }
    getAgi() { return this.agi; }
    getLuc() { return this.luc; }
    getAffinities() { return this.affinities; }
    getAttacks() { return this.attacks; }
    getAttackTypes() { return this.attackTypes; }
    getAttackDamages() { return this.attackDamages; }
    getSkills() { return this.skills; }
    getSkillCosts() { return this.skillCosts; }
    getSkillEffects() { return this.skillEffects; }
    getUser() { return this.user; }


    // setters
    setId(_id) { this.id = _id; }
    setName(_name) { this.name = _name; }
    setArcana(_arcana) { this.arcana = _arcana; }
    setSuit(_suit) { this.suit = _suit; }
    setLvl(_lvl) { this.lvl = _lvl; }
    setExp(_exp) { this.exp = _exp; }
    setStr(_str) { this.str = _str; }
    setMag(_mag) { this.mag = _mag; }
    setEnd(_end) { this.end = _end; }
    setAgi(_agi) { this.agi = _agi; }
    setLuc(_luc) { this.luc = _luc; }
    setAffinities(_affinities) { this.affinities = _affinities; }
    setAttacks(_attacks) { this.attacks = _attacks; }
    setAttacksTypes(_attackTypes) { this.attackTypes = _attackTypes; }
    setAttackDamages(_attackDamages) { this.attackDamages = _attackDamages; }
    setSkills(_skills) { this.skills = _skills; }
    setSkillCosts(_skillCosts) { this.skillCosts = _skillCosts; }
    setSkillEffects(_skillEffects) { this.skillEffects = _skillEffects; }
    setUser(_user) { this.user = _user; }
}
