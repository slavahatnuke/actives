var Definition = require('./Definition');

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
        return this.definitions.has(name) || this.values.has(name);
    }

    get(name) {
        if (this.values.has(name)) {
            return this.values.get(name);
        } else {
            return this.definitions.get(name);
        }
    }

    isResolved(name) {
        if (this.definitions.has(name)) {
            return this.get(name).isResolved();
        }

        return true;
    }

    getResolved(name) {
        if(this.definitions.has(name)) {
            return this.get(name).getResolved();
        }

        return this.values.get(name);
    }

    resolve(name, value) {
        if (this.definitions.has(name)) {
            this.definitions.get(name).resolve(value)
        } else {
            this.values.set(name, value);
        }
    }

};
