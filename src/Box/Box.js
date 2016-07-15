let Definition = require('./Definitions/Definition');
let Definitions = require('./Definitions/Definitions');
let Factory = require('./Factory/Factory');

let Reflection = require('../Reflection/Reflection');
let Connections = require('./Connections/Connections');
let Connection = require('./Connections/Connection');

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

        return this.definitions.getResolved(name);
    }

    keys() {
        return this.definitions.keys();
    }

    //@@ re-think, should it be public?
    create(name) {
        if (this.definitions.isDefinition(name)) {
            return this.factory.create(this, this.definitions.get(name));
        }
    }

    connect(name, service) {
        if (this.definitions.isDefinition(service)) {
            var definition = this.definitions.get(service);

            // @@ simplify constructor
            var connection = new Connection(name, service, definition);
            this.connections.add(name, connection);

            this.definitions.connect(service, (event) => connection.notify(this, event));
            return connection;
        } else {
            throw new Error('Unexpected connection, no definition');
        }

    }



    context(map = {}) {
        map['self'] = () => this;
        let names = this.keys().concat(Reflection.keys(map));
        names = Reflection.uniqueArray(names);

        return Reflection.defineNames({}, names, (name) => {
            var _name = map[name] || name;

            if(Reflection.isFunction(_name)) {
                return _name(this);
            }

            return this.get(_name);
        });
    }

    static create() {
        return new Box();
    }
}