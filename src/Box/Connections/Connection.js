module.exports = class Connection {
    constructor(name, service) {
        this.name = name;
        this.service = service;
        this.creator = undefined;
    }

    state(creator) {
        this.creator = creator;
        return this;
    }
}
