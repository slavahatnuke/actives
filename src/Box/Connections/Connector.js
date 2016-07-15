let DefinitionConnection = require('./DefinitionConnection');
let ConnectionConnection = require('./ConnectionConnection');
let Reflection = require('../../Reflection/Reflection');

module.exports = class Connector {
    constructor() {
        
    }
    
    static connect({name, service, box, definitions, connections}) {

        let connection;

        if (!connection && Reflection.isArray(service)) {
            throw '>>>>'
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

        if (!connection) {
            throw new Error('Unexpected connection, no definition or another connection');
        }

        connections.add(connection);
        return connection;
    }
}
