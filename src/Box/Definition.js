var Reflection = require('../Reflection/Reflection');

module.exports = class Definition {
    constructor(name, definition, dependencies) {
        this.name = name;
        this.definition = definition;
        this.dependencies = dependencies;

        this.resolved = false;
        this.value = undefined;
    }

    getName() {
        return this.name;
    }

    isResolved() {
        return this.resolved;
    }

    resolve(value) {
        this.value = value;
        this.resolved = true;
    }

    getResolved() {
        return this.value;
    }

    getDependencies() {
        return this.dependencies;
    }

    getDefinition() {
        return this.definition;
    }

    static create(name, definition, dependencies) {
        if (Reflection.isFunction(definition)) {
            return new Definition(name, definition, dependencies);
        } else {
            return definition;
        }
    }
}

