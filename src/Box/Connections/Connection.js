module.exports = class Connection {
    constructor(name, service, definition) {
        this.name = name;
        this.service = service;
        this.stateCreator = undefined;
        this.definition = definition;
    }

    getName() {
        return this.name;
    }

    state(creator) {
        this.stateCreator = creator;
        return this;
    }

    notify(box, event) {
        if(this.stateCreator) {
            var map = {
                [this.service]: () => this.definition.getOriginValue()
            };

            /// @@ cache context
            let context = box.context(map);
            // @@@@ handle results
            this.stateCreator(context);

        }
    }
}
