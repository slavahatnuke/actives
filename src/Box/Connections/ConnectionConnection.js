let Connection = require('./Connection');

module.exports = class ConnectionConnection extends Connection {
    constructor(name, service) {
        super(name);
        this.service = service;
    }

    notify(box, event) {

        this.resetState();

        if(this.stateCreator) {
            /// @@ cache context
            let context = box.context();
            this.applyState(this.stateCreator(context));
        }

        this.observer && this.observer.notify();
    }
}
