var Observer = require('../../Actives/Observer');
let Reflection = require('../../Reflection/Reflection');

module.exports = class Connection {
    constructor(name) {
        this.name = name;

        this.observer = undefined;
        this.stateCreator = undefined;
        this.stateValue = undefined;

        this.actionsCreator = undefined;
        this.actionsCalled = false;
        this.actionsValue = undefined;
    }

    getName() {
        return this.name;
    }

    state(creator) {
        if (Reflection.isFunction(creator)) {
            this.stateCreator = creator;
        }
        return this;
    }

    actions(creator) {
        if (Reflection.isFunction(creator)) {
            this.actionsCreator = creator;
        }
        return this;
    }

    subscribe(observer) {
        this.observer = this.observer || new Observer();
        this.observer.subscribe(observer);
    }

    notifyObservers() {
        this.observer && this.observer.notify();
    }

    hasState() {
        return !!this.stateValue;
    }

    getState() {
        return this.stateValue || {};
    }

    resetState() {
        this.stateValue = {};
    }

    applyState(state) {
        this.stateValue = this.stateValue || {};

        if (Reflection.isPureObject(state)) {
            Reflection.merge(this.stateValue, state);
        }
    }

    notify(box, event) {
        this.notifyIt(box);
    }

    notifyIt(box) {
        this.resetState();

        this.callActionsCreator(box);
        this.callStateCreator(box);

        this.notifyObservers();
    }

    callActionsCreator(box) {
        if (this.actionsCreator && !this.actionsCalled) {
            var value = this.actionsCreator(box.context());
            this.actionsValue = value;
            this.actionsCalled = true;
            this.applyState(value);
        } else {
            this.applyState(this.actionsValue);
        }
    }

    callStateCreator(box) {
        if (this.stateCreator) {
            this.applyState(this.stateCreator(this.getContext(box)));
        }
    }

    getContext(box) {
        return box.context();
    }

    reset() {
        // @@ need re-think
    }

    destroy() {
        // @@ need re-think
    }

}
