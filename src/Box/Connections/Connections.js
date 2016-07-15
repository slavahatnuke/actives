var Connection = require('./Connection');

module.exports = class Connections {
    constructor() {
        this.connections = new Map();
    }

    add(name, connection) {
        if(connection instanceof Connection) {
            this.connections.set(connection.getName(), connection);
        }
    }
}
