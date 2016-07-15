var Connection = require('./DefinitionConnection');

module.exports = class Connections {
    constructor() {
        this.connections = new Map();
    }

    add(connection) {
        if(connection instanceof Connection) {
            this.connections.set(connection.getName(), connection);
        }
    }
}
