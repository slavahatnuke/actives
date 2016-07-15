var Observer = require('../../Actives/Observer');
let Reflection = require('../../Reflection/Reflection');

module.exports = class Connection {
    constructor(name) {
        this.name = name;

        this.observer = undefined;
        this.stateCreator = undefined;
        this.actionsCreator = undefined;
        this.stateValue = undefined;
    }

    getName() {
        return this.name;
    }

    state(creator) {
        this.stateCreator = creator;
        return this;
    }

    actions(creator) {
        this.actionsCreator = creator;
        return this;
    }

    subscribe(observer) {
        this.observer = this.observer || new Observer();
        this.observer.subscribe(observer);
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

    reset() {
        // @@ need re-think
    }

    destroy() {
        // @@ need re-think
    }

}
