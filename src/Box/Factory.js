let Reflection = require('../Reflection/Reflection');

let Creator = require('./Factory/Creator');
let ClassCreator = require('./Factory/ClassCreator');
let FunctionCreator = require('./Factory/FunctionCreator');

module.exports = class Factory {
    create(box, definition) {
        return Factory.getCreator(definition).getCreator(box)()
    }

    static getCreator(definition) {
        if (Reflection.isClass(definition.getDefinition())) {
            return new ClassCreator(definition);
        } else if (Reflection.isFunction(definition.getDefinition())) {
            return new FunctionCreator(definition);
        } else {
            return new Creator(definition);
        }
    }
}
