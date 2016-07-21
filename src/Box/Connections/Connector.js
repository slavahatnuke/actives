let DefinitionConnection = require('./DefinitionConnection');
let Connection = require('./Connection');
let ConnectionConnection = require('./ConnectionConnection');
let ArrayConnection = require('./ArrayConnection');
let ObjectConnection = require('./ObjectConnection');

let Reflection = require('../../Reflection/Reflection');
let BoxReflection = require('../../Box/Reflection/BoxReflection');
let Accessor = require('../Accessor/Accessor');

module.exports = class Connector {
    static createConnection({name, service, box}) {

        let definitions = BoxReflection.getDefinitions(box);
        let connections = BoxReflection.getConnections(box);

        let connection;

        if (!connection && definitions.isDefinition(service)) {
            var definition = definitions.get(service);
            connection = new DefinitionConnection(name, service, definition);
            definition.subscribe((event) => connection.notify(box, event));
        }

        if (!connection && connections.has(service)) {
            connection = new ConnectionConnection(name, service);
            connections.get(service).subscribe((event) => connection.notify(box, event));
        }

        if (!connection && Reflection.isPureObject(service)) {
            connection = new ObjectConnection(name, service);

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
            connection = new ArrayConnection(name, service);

            let items = service.map((service) => {
                var child = this.createConnection({
                    name: service,
                    service,
                    box
                });
            // console.log(service, child);

                child.subscribe((event) => connection.notify(box, event));
                return child;
            });

            connection.setConnections(items);
        }

        if (!connection && Accessor.isPath(service)) {
            let _path = Accessor.toArray(service);
            let _service = _path.pop();

            let _box = Accessor.path(_path)(box);
            if (BoxReflection.isBox(_box)) {
                connection = this.createConnection({
                    name: name,
                    service: _service,
                    box: _box
                });
            } else {
                throw new Error('Unexpected path to connected service: ' + service);
            }
        }

        if (!connection) {
            throw new Error('Unexpected connection, no definition or another connection');
        }

        return connection;
    }

    static connect({name, service, box}) {
        let connections = BoxReflection.getConnections(box);

        box.remove(name);

        let connection;

        if (service instanceof Connection) {
            let _connection = service;

            connection = this.createConnection({
                name,
                service: _connection.getService(),
                box
            });

            connection.state(_connection.stateCreator).actions(_connection.actionsCreator);

        } else {
            connection = this.createConnection({
                name,
                service,
                box
            });
        }

        connections.add(connection);

        BoxReflection.addName(box, name);

        return connection;
    }
}
