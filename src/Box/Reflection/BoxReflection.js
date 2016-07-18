let Reflection = require('../../Reflection/Reflection');
var Definition = require('../Definitions/Definition');

module.exports = class BoxReflection {

    static getDefinitions(box) {
        return box._definitions;
    }
    
    static getDefinition(box, name) {
        return this.getDefinitions(box).get(name    );
    }
    
    static addBox({box, name, child, dependencies}) {
        var definition = new Definition(name, child, dependencies);
        definition.setMeta({box: true});

        this.getDefinitions(box).add(name, definition);
    }

    static has(box, name) {
        return box._connections.has(name) || box._definitions.has(name);
    }

    static addName({box, name}) {
        if(!box._names.has(name)) {
            Reflection.defineName(box, name, (name) => box.get(name), (name, value) => box.add(name, value));
            box._names.set(name, name);
        }
    }
}
