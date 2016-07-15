let Connection = require('./Connection');

module.exports = class DefinitionConnection extends Connection {
    constructor(name, definition) {
        super(name);
        this.service = definition.getName();
        this.definition = definition;
        this.context = undefined;
    }

    notify(box, event) {

        box.get(this.service); // needs for init

        this.resetState();

        if (this.stateCreator) {
            var context = this.getContext(box);
            this.applyState(this.stateCreator(context));
        }

        this.observer && this.observer.notify();
    }

    getContext(box) {

        if (!this.context) {
            this.context = box.context({
                [this.service]: () => this.definition.getOriginValue()
            });
        }

        return this.context;
    }
}
