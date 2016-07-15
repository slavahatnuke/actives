var Reflection = require('../../Reflection/Reflection');
var Observer = require('../Actives/Observer');
var ObjectObserver = require('../Actives/ObjectObserver');

module.exports = class Definition {
    constructor(name, definition, dependencies) {
        this.name = name;
        this.definition = definition;
        this.dependencies = dependencies;

        this.resolved = false;
        this.value = undefined;
        this.originValue = undefined;
        this.observer = undefined;
        this.connected = false;
    }

    getName() {
        return this.name;
    }

    isResolved() {
        return this.resolved;
    }

    resolve(value) {
        this.originValue = value

        if(this.isConnected()) {
            this.value = new ObjectObserver(value, (payload) => this.observer.notify(payload));
        } else {
            this.value = value;
        }

        this.resolved = true;

    }

    getOriginValue() {
        return this.originValue;
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

    connect(observer) {
        this.connected = true;
        this.observer = this.observer || new Observer();
        this.observer.subscribe(observer);
    }

    isConnected() {
        return this.connected;
    }

    static create(name, definition, dependencies) {
        if (Reflection.isFunction(definition)) {
            return new Definition(name, definition, dependencies);
        } else {
            return definition;
        }
    }
}

