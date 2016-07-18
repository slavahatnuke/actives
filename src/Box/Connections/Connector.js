let DefinitionConnection = require('./DefinitionConnection');
let ConnectionConnection = require('./ConnectionConnection');
let ArrayConnection = require('./ArrayConnection');
let ObjectConnection = require('./ObjectConnection');

let Reflection = require('../../Reflection/Reflection');
let BoxReflection = require('../../Box/Reflection/BoxReflection');

module.exports = class Connector {
    static createConnection({name, service, box}) {

        let definitions = BoxReflection.getDefinitions(box);
        let connections = BoxReflection.getConnections(box);

        let connection;

        if (!connection && Reflection.isPureObject(service)) {
            connection = new ObjectConnection(name);

            let items = {};

            for (var name in service) {
                var value = service[name];

                var child = this.createConnection({
                    name: value,
                    service: value,
                    box
                });

                items[name] = child;

                child.subscribe((event) => connection.notify(box, event));
            }

            connection.setConnections(items);
        }

        if (!connection && Reflection.isArray(service)) {
            connection = new ArrayConnection(name);

            let items = service.map((service) => {
                var child = this.createConnection({
                    name: service,
                    service,
                    box
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

    static connect({name, service, box}) {
        let connections = BoxReflection.getConnections(box);

        box.remove(name);

        let connection = this.createConnection({
            name,
            service,
            box
        });

        if (!connection) {
            throw new Error('Unexpected connection, no definition or another connection');
        }

        connections.add(connection);

        BoxReflection.addName(box, name);

        return connection;
    }
}
