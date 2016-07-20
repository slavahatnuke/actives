let Observer = require('../../Actives/Observer');
let Reflection = require('../../Reflection/Reflection');

let connectionSymbol = Symbol("connection");

module.exports = class Connection {
    constructor(name) {
        this.name = name;

        this.reset();
    }

    reset() {
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

    model(creator) {
        return this.state(creator);
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

    unsubscribe(observer) {
        this.observer && this.observer.unsubscribe(observer);
    }

    notifyObservers(box, event) {
        this.observer && this.observer.notify(event, this.getState());
    }

    hasState() {
        return !!this.stateValue;
    }

    getState() {
        return this.stateValue || this.resetState();
    }

    resetState() {
        this.stateValue = {};
        this.stateValue[connectionSymbol] = this;
        return this.stateValue;
    }

    applyState(state) {
        this.stateValue = this.getState();

        if (Reflection.isPureObject(state)) {
            Reflection.merge(this.stateValue, state);
        }
    }

    notify(box, event) {
        this.notifyIt(box, event);
    }

    notifyIt(box, event) {
        this.resetState();

        this.callActionsCreator(box);
        this.callStateCreator(box);

        this.notifyObservers(box, event);
    }

    callActionsCreator(box) {
        if (this.actionsCreator && !this.actionsCalled) {
            var value = this.actionsCreator(this.getActionsContext(box));
            this.actionsValue = value;
            this.actionsCalled = true;
            this.applyState(value);
        } else {
            this.applyState(this.actionsValue);
        }
    }

    getActionsContext(box) {
        return box.context();
    }

    callStateCreator(box) {
        if (this.stateCreator) {
            this.applyState(this.stateCreator(this.getStateContext(box)));
        }
    }

    getOriginValue() {
        return this.getState();
    }

    getValue() {
        return this.getOriginValue();
    }

    getStateContext(box) {
        return box.context();
    }

    static subscribe(state, subscriber) {
        let connection = state[connectionSymbol];
        if(connection) {
            connection.subscribe(subscriber)
        }
    }

    static unsubscribe(state, subscriber) {
        let connection = state[connectionSymbol];
        if(connection) {
            connection.unsubscribe(subscriber)
        }
    }
}
