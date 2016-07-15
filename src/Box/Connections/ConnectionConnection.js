let Connection = require('./Connection');

module.exports = class ConnectionConnection extends Connection {
    constructor(name, service) {
        super(name);
        this.service = service;
    }

    notify(box, event) {
        console.log('here');

        this.resetState();

        if(this.stateCreator) {
            var map = {
                [this.service]: () => this.definition.getOriginValue()
            };

            /// @@ cache context
            let context = box.context(map);
            // @@@@ handle results
            this.applyState(this.stateCreator(context));
        }

        this.observer && this.observer.notify();
    }
}
