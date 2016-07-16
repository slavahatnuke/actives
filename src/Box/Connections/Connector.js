let DefinitionConnection = require('./DefinitionConnection');
let ConnectionConnection = require('./ConnectionConnection');
let ArrayConnection = require('./ArrayConnection');

let Reflection = require('../../Reflection/Reflection');

module.exports = class Connector {
    constructor() {

    }

    static createConnection({name, service, box, definitions, connections}) {

        let connection;

        if (!connection && Reflection.isArray(service)) {
            connection = new ArrayConnection(name);

            let items = service.map((service) => {
                var child = this.createConnection({
                    name: service,
                    service,
                    box,
                    definitions,
                    connections
                });

                child.subscribe((event) => connection.notify(box, event));
                return child;
            });

            connection.setConnections(items);
        }

        if (!connection && definitions.isDefinition(service)) {
            var definition = definitions.get(service);
            connection = new DefinitionConnection(name, definition);
            definition.connect((event) => connection.notify(box, event));
        }

        if (!connection && connections.has(service)) {
            connection = new ConnectionConnection(name);
            connections.get(service).subscribe((event) => connection.notify(box, event));
        }

        return connection;
    }

    static connect({name, service, box, definitions, connections}) {
        connections.remove(name);
        
        let connection = this.createConnection({
            name,
            service,
            box,
            definitions,
            connections
        });

        if (!connection) {
            throw new Error('Unexpected connection, no definition or another connection');
        }

        connections.add(connection);
        return connection;
    }
}
