let Connection = require('./Connection');

module.exports = class ConnectionConnection extends Connection {
    constructor(name, service) {
        super(name);
        this.service = service;
    }

}
