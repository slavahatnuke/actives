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


                child.subscribe((event) => {
                    var result = Connector.getBoxPath(box, value);
                    var connections = BoxReflection.getConnections(result.box);

                    if (connections.has(result.service)) {
                        var originalChildConnection = connections.get(result.service);
                        child.resetState();
                        child.applyState(originalChildConnection.getState());
                    }
                    return connection.notify(box, event);
                });
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

                child.subscribe((event) => {
                    if (connections.has(service)) {
                        var originalChildConnection = connections.get(service);
                        child.resetState();
                        child.applyState(originalChildConnection.getState());
                    }

                    return connection.notify(box, event);
                });

                return child;
            });

            connection.setConnections(items);
        }

        if (!connection && Accessor.isPath(service)) {
            var _result = Connector.getBoxPath(box, service);
            connection = this.createConnection({
                name: name,
                service: _result.service,
                box: _result.box
            });
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

    static getBoxPath(box, path) {

        if(Accessor.isPath(path)) {
            let _path = Accessor.toArray(path);
            let service = _path.pop();

            let _box = Accessor.path(_path)(box);
            if (BoxReflection.isBox(_box)) {
                return {
                    box: _box,
                    service: service
                };
            } else {
                throw new Error('Unexpected path to connected service: ' + service);
            }
        } else {
            return {
                box: box,
                service: path
            };
        }
    }
}
