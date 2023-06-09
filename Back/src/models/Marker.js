export class Marker {
    
    constructor(_id, _label, _lat, _lon, _icon, _bgColor, _hidden) {
        this.id = _id;
        this.label = _label;
        this.lat = _lat;
        this.lon = _lon;
        this.icon = _icon;
        this.bgColor = _bgColor;
        this.hidden = _hidden;
    }

    // getters
    getId() {return this.id;}
    getLabel() {return this.label;}
    getLat() {return this.lat;}
    getLon() {return this.lon;}
    getIcon() {return this.icon;}
    getBgColor() {return this.bgColor;}
    isHidden() {return this.hidden;}

    // setters
    setId(_id) {this.id = _id;}
    setLabel(_label) {this.label = _label;}
    setLat(_lat) {this.lat = _lat;}
    setLon(_lon) {this.lon = _lon;}
    setIcon(_icon) {this.icon = _icon;}
    setBgColor(_bgColor) {this.bgColor = _bgColor;}
    setHidden(_hidden) {this.hidden = _hidden;}

}
