var Definition = require('./Definition');
var Reflection = require('../Reflection/Reflection');

module.exports = class Definitions {
    constructor() {
        this.definitions = new Map();
        this.values = new Map();
    }

    add(name, definition) {
        if (definition instanceof Definition) {
            this.definitions.set(definition.getName(), definition);
        } else {
            this.values.set(name, definition);
        }
    }

    has(name) {
        return this.isDefinition(name) || this.isValue(name);
    }

    get(name) {
        if (this.isDefinition(name)) {
            return this.definitions.get(name);
        } else {
            return this.values.get(name);
        }
    }

    isResolved(name) {
        if (this.isDefinition(name)) {
            return this.get(name).isResolved();
        }

        return true;
    }

    isDefinition(name) {
        return this.definitions.has(name);
    }

    isValue(name) {
        return this.values.has(name);
    }

    getResolved(name) {
        if (this.isDefinition(name)) {
            return this.get(name).getResolved();
        }

        return this.values.get(name);
    }

    resolve(name, value) {
        if (this.isDefinition(name)) {
            this.definitions.get(name).resolve(value)
        } else {
            this.values.set(name, value);
        }
    }

    keys() {
        return Reflection.iteratorToArray(this.values.keys()).concat(Reflection.iteratorToArray(this.definitions.keys()));
    }

};
