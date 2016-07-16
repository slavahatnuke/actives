let Definition = require('./Definitions/Definition');
let Definitions = require('./Definitions/Definitions');
let Factory = require('./Factory/Factory');

let Reflection = require('../Reflection/Reflection');
let Connections = require('./Connections/Connections');

let Connector = require('./Connections/Connector');
let Accessor = require('./Accessor/Accessor');

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

        if(Accessor.isPath(name)) {
            return Accessor.path(name)(this);
        }

        if (!this.definitions.isResolved(name)) {
            this.definitions.resolve(name, this.create(name));
        }

        if (this.connections.has(name)) {
            if(!this.connections.get(name).hasState()) {
                this.connections.get(name).notify(this, {
                    type: 'CONNECTION_INIT',
                    name: name,
                    box: this
                });
            }

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
        return Connector.connect({
            name: name,
            service: service,
            box: this,
            definitions: this.definitions,
            connections: this.connections
        });
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