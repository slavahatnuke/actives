var Connection = require('./Connection');
var Reflection = require('../../Reflection/Reflection');

module.exports = class Connections {
    constructor() {
        this.connections = new Map();
    }

    add(connection) {
        if(connection instanceof Connection) {
            this.connections.set(connection.getName(), connection);
        }
    }

    get(name) {
        return this.connections.get(name);
    }

    has(name) {
        return this.connections.has(name);
    }

    keys() {
        return Reflection.iteratorToArray(this.connections.keys());
    }
}
