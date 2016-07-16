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
        this.contextValue = undefined;
    }

    add(name, definition, dependencies) {
        this.remove(name);
        this.definitions.add(name, Definition.create(name, definition, dependencies));

        if (definition instanceof Box) {
            Factory.addBox({
                box: this,
                child: definition,
                dependencies: dependencies
            });
        }

        return this;
    }

    get(name) {
        if (name === 'self') {
            return this;
        }

        if (Accessor.isPath(name)) {
            return Accessor.path(name)(this);
        }

        if (!this.definitions.isResolved(name)) {
            this.definitions.resolve(name, this.create(name));
        }

        if (this.connections.has(name)) {
            if (!this.connections.get(name).hasState()) {
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

    remove(name) {
        if (this.definitions.has(name)) {
            this.definitions.remove(name);
        }

        if (this.connections.has(name)) {
            this.connections.remove(name);
        }
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


    context(map = null) {
        if (!map && this.contextValue) {
            return this.contextValue;
        }

        let _map = map || {};
        _map['self'] = () => this;

        let names = this.keys().concat(Reflection.keys(_map));
        names = Reflection.uniqueArray(names);

        let context = Reflection.defineNames({}, names, (name) => {
            var _name = _map[name] || name;

            if (Reflection.isFunction(_name)) {
                return _name(this.context());
            }

            return this.get(_name);
        });

        if (!map) {
            this.contextValue = context;
        }

        return context;
    }

    static create() {
        return new Box();
    }
}