let Connection = require('./Connection');
let Reflection = require('../../Reflection/Reflection');

module.exports = class Connections {
    constructor() {
        this._connections = new Map();
    }

    add(connection) {
        if(connection instanceof Connection) {
            this._connections.set(connection.getName(), connection);
        }
    }

    get(name) {
        return this._connections.get(name);
    }

    has(name) {
        return this._connections.has(name);
    }

    keys() {
        return Reflection.iteratorToArray(this._connections.keys());
    }

    remove(name) {
        if(this.has(name)) {
            this.get(name).reset();
        }
    }
}
