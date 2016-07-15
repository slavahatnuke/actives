let Connection = require('./Connection');

module.exports = class ArrayConnection extends Connection {
    constructor(name) {
        super(name);
        this.connections = undefined;
        this.context = undefined;
    }

    setConnections(connections) {
        this.connections = connections;
    }

    makeRelations(box, event) {
        this.connections.forEach((connection) => box.get(connection.getName()));
    }

    notify(box, event) {
        if (event.type === 'CONNECTION_INIT') {
            this.makeRelations(box, event);
        }

        this.notifyIt(box, event);
    }

    getContext(box) {

        if (!this.context) {
            var map = {};

            this.connections.forEach((connection) => {
                map[connection.getName()] = () => connection.getOriginValue();
            });

            this.context = box.context(map);
        }

        return this.context;
    }
}
