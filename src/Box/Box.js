let Definition = require('./Definition');
let Definitions = require('./Definitions');
let Factory = require('./Factory');

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

    static create() {
        return new Box();
    }
}