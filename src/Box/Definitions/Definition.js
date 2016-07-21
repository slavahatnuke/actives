let Reflection = require('../../Reflection/Reflection');
let Observer = require('../../Actives/Observer');
let ObjectObserver = require('../../Actives/ObjectObserver');
let FunctionObserver = require('../../Actives/FunctionObserver');
// let Box = require('../Box');

module.exports = class Definition {
    constructor(name, definition, dependencies) {
        this.name = name;
        this.definition = definition;
        this.dependencies = dependencies;

        this.reset();
    }

    setMeta(meta = {}) {
        this.meta = this.meta || {};
        Reflection.merge(this.meta, meta)
    }

    getMeta() {
        this.setMeta();
        return this.meta;
    }

    getName() {
        return this.name;
    }

    getValue() {
        return this.value;
    }

    isResolved() {
        return this.resolved;
    }

    resolve(value) {
        this.originValue = value;
        this.value = value;

        if (this.isConnected()) {
            if (Reflection.isPureObject(value)) {
                this.value = ObjectObserver(value, (payload) => this.observer.notify(payload));
            } else if (Reflection.isFunction(value)) {
                this.value = FunctionObserver(value, {}, (payload) => this.observer.notify(payload))
            }
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

    subscribe(observer) {
        if(!this.isConnected() && this.isResolved()) {
            this.connected = true;
            this.resolve(this.getValue());
        }

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
        this.meta = undefined;
    }

    clone() {
        return new Definition(this.name, this.definition, this.dependencies);
    }

    static create(name, definition, dependencies) {
        if (Reflection.isFunction(definition)) {
            return new Definition(name, definition, dependencies);
        } else if (definition instanceof Definition) {
            return definition;
        } else if (Reflection.isPureObject(definition)) {
            var _definition = new Definition(name, definition, dependencies);
            _definition.resolve(definition);
            return _definition;
        } else {
            return definition;
        }
    }
}

