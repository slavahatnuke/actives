let Observer = require('../../Actives/Observer');
let Reflection = require('../../Reflection/Reflection');

let connectionSymbol =  '___Symbol__connection';

module.exports = class Connection {
    constructor(name, service) {
        this.name = name;
        this.service = service;

        this.reset();
    }


    init(box) {
        if (!this.hasState()) {
            this.notify(box, {
                type: 'CONNECTION_INIT',
                name: this.getName(),
                box: box
            });
        }
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

    getService() {
        return this.service;
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
        var state = this.getState();
        this.observer && this.observer.notify(event, Connection.clearState(state));
    }

    hasState() {
        return !!this.stateValue;
    }

    getState() {
        var state = this.stateValue || this.resetState();
        Connection.defineSymbol(state, this);
        return state;
    }

    resetState() {
        this.stateValue = {};
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

    callStateCreator(box) {
        if (this.stateCreator) {
            this.applyState(this.stateCreator(this.getStateContext(box)));
        }
    }

    getActionsContext(box) {
        return box.context();
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

    static isStateObject(state) {
        return state[connectionSymbol];
    }

    static subscribe(state, subscriber) {
        let connection = state[connectionSymbol];
        if (connection) {
            connection.subscribe(subscriber)
        }
    }

    static unsubscribe(state, subscriber) {
        let connection = state[connectionSymbol];
        if (connection) {
            connection.unsubscribe(subscriber)
        }
    }

    static clearState(state) {
        if (Connection.isStateObject(state)) {
            state[connectionSymbol] && delete state[connectionSymbol];
        }

        return state;
    }

    static defineSymbol(state, connection) {
        if (Reflection.isString(connectionSymbol)) {
            if (!Connection.isStateObject(state)) {
                Reflection.defineName(state, connectionSymbol, () => connection, null, true);
            }
        } else {
            state[connectionSymbol] = connection;
        }

        return state;
    }
};
