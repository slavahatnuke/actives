let Definition = require('./Definitions/Definition');
let Definitions = require('./Definitions/Definitions');
let Factory = require('./Factory/Factory');

let Reflection = require('../Reflection/Reflection');
let Connections = require('./Connections/Connections');

let Connector = require('./Connections/Connector');
let Accessor = require('./Accessor/Accessor');
let BoxReflection = require('./Reflection/BoxReflection');

module.exports = class Box {
    constructor() {
        this._definitions = new Definitions();
        this._connections = new Connections();
        this._factory = new Factory();
        this._contextValue = undefined;
        this._names = new Map();

        BoxReflection.addName({
            box: this,
            name: 'self'
        });
    }

    add(name, definition, dependencies) {
        this.remove(name);

        if (definition instanceof Box) {
            BoxReflection.addBox({
                box: this,
                name: name,
                child: definition,
                dependencies: dependencies
            });
        } else {
            this._definitions.add(name, Definition.create(name, definition, dependencies));
        }

        BoxReflection.addName({
            box: this,
            name
        });
        
        return this;
    }

    get(name) {
        if (name === 'self') {
            return this;
        }

        if (Accessor.isPath(name)) {
            return Accessor.path(name)(this);
        }

        if (!this._definitions.isResolved(name)) {
            this._definitions.resolve(name, this.create(name));
        }

        if (this._connections.has(name)) {
            if (!this._connections.get(name).hasState()) {
                this._connections.get(name).notify(this, {
                    type: 'CONNECTION_INIT',
                    name: name,
                    box: this
                });
            }

            return this._connections.get(name).getState();
        }

        return this._definitions.getResolved(name);
    }

    remove(name) {

        if (this._definitions.has(name)) {
            this._definitions.remove(name);
        }

        if (this._connections.has(name)) {
            this._connections.remove(name);
        }
    }

    keys() {
        return this._definitions.keys().concat(this._connections.keys());
    }

    //@@ re-think, should it be public?
    create(name) {
        if (this._definitions.isDefinition(name)) {
            return this._factory.create(this, this._definitions.get(name));
        }
    }

    connect(name, service) {
        return Connector.connect({
            box: this,
            name: name,
            service: service,
            definitions: this._definitions,
            connections: this._connections
        });
    }


    context(map = null) {
        if (!map && this._contextValue) {
            return this._contextValue;
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
            this._contextValue = context;
        }

        return context;
    }

    static create() {
        return new Box();
    }
}