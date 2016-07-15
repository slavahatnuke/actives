let Definition = require('./Definitions/Definition');
let Definitions = require('./Definitions/Definitions');
let Factory = require('./Factory/Factory');

let Reflection = require('../Reflection/Reflection');
let Connections = require('./Connections/Connections');

let DefinitionConnection = require('./Connections/DefinitionConnection');
let ConnectionConnection = require('./Connections/ConnectionConnection');

module.exports = class Box {
    constructor() {
        this.definitions = new Definitions();
        this.connections = new Connections();
        this.factory = new Factory();
    }

    add(name, definition, dependencies) {
        this.definitions.add(name, Definition.create(name, definition, dependencies));
        return this;
    }

    get(name) {
        if (name === 'self') {
            return this;
        }

        if (!this.definitions.isResolved(name)) {
            this.definitions.resolve(name, this.create(name));
        }

        if (this.connections.has(name)) {
            return this.connections.get(name).getState();
        }

        return this.definitions.getResolved(name);
    }

    keys() {
        return this.definitions.keys().concat(this.connections.keys());
    }

    //@@ re-think, should it be public?
    create(name) {
        if (this.definitions.isDefinition(name)) {
            return this.factory.create(this, this.definitions.get(name));
        }
    }

    connect(name, service) {

        let connection;

        if (!connection && this.definitions.isDefinition(service)) {
            var definition = this.definitions.get(service);
            connection = new DefinitionConnection(name, definition);
            definition.subscribe((event) => connection.notify(this, event));
        }

        if (!connection && this.connections.has(service)) {
            connection = new ConnectionConnection(name, service);
            this.connections.get(service).subscribe((event) => connection.notify(this, event));
        }

        if (!connection) {
            throw new Error('Unexpected connection, no definition or another connection');
        }

        this.connections.add(connection);
        return connection;
    }


    context(map = {}) {
        map['self'] = () => this;
        let names = this.keys().concat(Reflection.keys(map));
        names = Reflection.uniqueArray(names);

        return Reflection.defineNames({}, names, (name) => {
            var _name = map[name] || name;

            if (Reflection.isFunction(_name)) {
                return _name(this);
            }

            return this.get(_name);
        });
    }

    static create() {
        return new Box();
    }
}