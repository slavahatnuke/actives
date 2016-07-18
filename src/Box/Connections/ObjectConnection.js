let Connection = require('./Connection');

module.exports = class ObjectConnection extends Connection {
    constructor(name) {
        super(name);
        this.connections = undefined;
        this.stateContext = undefined;
        this.actionsContext = undefined;
    }

    setConnections(connections) {
        this.connections = connections;
    }

    makeRelations(box, event) {
        for (var name in this.connections) {
            box.get(this.connections[name].getName());
        }
    }

    notify(box, event) {
        if (event && event.type === 'CONNECTION_INIT') {
            this.makeRelations(box, event);
        }

        this.notifyIt(box, event);
    }

    getStateContext(box) {
        if (!this.stateContext) {
            var map = {};

            let define = (key, connection) => map[key] = () => connection.getOriginValue();

            for (var name in this.connections) {
                define(name, this.connections[name]);
            }

            this.stateContext = box.context(map);
        }

        return this.stateContext;
    }


    getActionsContext(box) {
        if (!this.actionsContext) {
            var map = {};

            let define = (key, connection) => map[key] = () => connection.getValue();

            for (var name in this.connections) {
                define(name, this.connections[name]);
            }

            this.actionsContext = box.context(map);
        }

        return this.actionsContext;
    }

    reset() {
        this.connections = undefined;
        this.stateContext = undefined;
        super.reset();
    }

}
