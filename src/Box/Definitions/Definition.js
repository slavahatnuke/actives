let Reflection = require('../../Reflection/Reflection');
let Observer = require('../../Actives/Observer');
let ObjectObserver = require('../../Actives/ObjectObserver');
let FunctionObserver = require('../../Actives/FunctionObserver');

module.exports = class Definition {
    constructor(name, definition, dependencies) {
        this.name = name;
        this.definition = definition;
        this.dependencies = dependencies;

        this.reset();
    }

    getName() {
        return this.name;
    }

    isResolved() {
        return this.resolved;
    }

    resolve(value) {
        this.originValue = value;

        if (this.isConnected()) {
            if (Reflection.isPureObject(value)) {
                this.value = ObjectObserver(value, (payload) => this.observer.notify(payload));
            } else if (Reflection.isFunction(value)) {
                this.value = FunctionObserver(value, {}, (payload) => this.observer.notify(payload))
            } else {
                this.value = value;
            }
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
        this.subscribe(observer);
    }

    subscribe(observer) {
        this.connected = true;
        this.observer = this.observer || new Observer();
        this.observer.subscribe(observer);
    }

    isConnected() {
        return this.connected;
    }

    reset() {
        this.resolved = false;
        this.value = undefined;
        this.originValue = undefined;
        this.observer = undefined;
        this.connected = false;
    }

    static create(name, definition, dependencies) {
        if (Reflection.isFunction(definition)) {
            return new Definition(name, definition, dependencies);
        } else if(Reflection.isPureObject(definition)){
            var _definition = new Definition(name, definition);
            _definition.resolve(definition);
            return _definition;
        } else {
            return definition;
        }
    }
}

