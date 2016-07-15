let Definition = require('./Definitions/Definition');
let Definitions = require('./Definitions/Definitions');
let Factory = require('./Factory/Factory');
let Connection = require('./Connections/Connection');

module.exports = class Box {
    constructor() {
        this.definitions = new Definitions();
        this.factory = new Factory();
    }

    add(name, definition, dependencies) {
        this.definitions.add(name, Definition.create(name, definition, dependencies));
        return this;
    }

    get(name) {
        if(name === 'container') {
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
        return new Connection(name, service);
    }

    static create() {
        return new Box();
    }
}