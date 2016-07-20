let Reflection = require('../../Reflection/Reflection');
var Definition = require('../Definitions/Definition');
module.exports = class BoxReflection {

    static getDefinitions(box) {
        return box._definitions;
    }

    static getConnections(box) {
        return box._connections;
    }

    static addBox({box, name, child, dependencies}) {
        var definition = new Definition(name, child, dependencies);
        definition.setMeta({box: true});

        this.getDefinitions(box).add(name, definition);
    }

    static addName(box, name) {
        if (!box._names.has(name) && !(name in box)) {
            Reflection.defineName(box, name, (name) => box.get(name), (name, value) => box.add(name, value));
            box._names.set(name, name);
        }
    }

    static isBox(box) {
        return box instanceof require('../Box');
    }
}
