let Connection = require('./Connection');

module.exports = class DefinitionConnection extends Connection {
    constructor(name, definition) {
        super(name);
        this.service = definition.getName();
        this.definition = definition;
    }

    notify(box, event) {
        this.resetState();

        if (this.stateCreator) {
            var map = {
                [this.service]: () => this.definition.getOriginValue()
            };

            /// @@ cache context
            let context = box.context(map);
            var state = this.stateCreator(context);
            this.applyState(state);
        }

        this.observer && this.observer.notify();
    }
}
