export class User {

    constructor(_id, _username, _key, _admin) {
        this.id = _id;
        this.username = _username;
        this.key = _key;
        this.admin = _admin;
    }

    // getters
    getId() { return this.id; }
    getUsername() { return this.username; }
    getKey() { return this.key; }
    getAdmin() { return this.admin; }

    // setters
    setId(_id) { this.id = _id; }
    setUsername(_username) { this.username = _username; }
    setKey(_key) { this.key = _key; }
    setAdmin(_admin) { this.admin = _admin; }

}
