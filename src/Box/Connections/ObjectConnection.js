let Connection = require('./Connection');

module.exports = class ObjectConnection extends Connection {
    constructor(name) {
        super(name);
        this.connections = undefined;
        this.context = undefined;
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

    getContext(box) {
        if (!this.context) {
            var map = {};

            let define = (key, connection) => map[key] = () => connection.getOriginValue();

            for (var name in this.connections) {
                define(name, this.connections[name]);
            }

            this.context = box.context(map);
        }

        return this.context;
    }

    reset() {
        this.connections = undefined;
        this.context = undefined;
        super.reset();
    }

}
