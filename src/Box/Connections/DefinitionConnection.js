let Connection = require('./Connection');

module.exports = class DefinitionConnection extends Connection {
    constructor(name, definition) {
        super(name);
        this.service = definition.getName();
        this.definition = definition;
        this.context = undefined;
    }

    notify(box, event) {
        if (event.type == 'CONNECTION_INIT') {
            box.get(this.service);
        }
        
        this.notifyIt(box, event);
    }

    getStateContext(box) {

        if (!this.context) {
            this.context = box.context({
                [this.service]: () => this.getOriginValue()
            });
        }

        return this.context;
    }

    getValue() {
        return this.definition.getValue();
    }


    getOriginValue() {
        return this.definition.getOriginValue();
    }
}
