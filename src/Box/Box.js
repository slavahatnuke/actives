let Definition = require('./Definition');
let Definitions = require('./Definitions');
let Factory = require('./Factory');

new Definitions();

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
        if(!this.definitions.isResolved(name)) {
            this.definitions.resolve(name, this.create(name));
        }

        return this.definitions.getResolved(name);
    }

    create(name) {
        return this.factory.create(this, this.definitions, name);
    }
    
    static create() {
        return new Box();
    }
}