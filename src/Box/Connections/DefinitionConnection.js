let Connection = require('./Connection');

module.exports = class DefinitionConnection extends Connection {
    constructor(name, definition) {
        super(name);
        this.service = definition.getName();
        this.definition = definition;
        this.context = undefined;
    }

    notify(box, event) {
        this.resetState();

        if (this.stateCreator) {
            this.applyState(this.stateCreator(this.getContext(box)));
        }

        this.observer && this.observer.notify();
    }

    getContext(box) {
        if (!this.context) {

            var map = {
                [this.service]: () => this.definition.getOriginValue()
            };

            this.context = box.context(map);
        }

        return this.context;
    }
}
