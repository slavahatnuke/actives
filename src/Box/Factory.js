let Reflection = require('../Reflection/Reflection');

module.exports = class Factory {
    constructor() {

    }

    create(box, definitions, name) {
        let definition = definitions.get(name);
        let dependencies = this.createDependencies(box, definition);
        let creator = this.getCreator(definition, dependencies);
        return creator();
    }

    getCreator(definition, dependencies) {

        if (Reflection.isClass(definition.getDefinition())) {

            let _class = definition.getDefinition();
            let _a = dependencies;

            let a = dependencies
                .map(function (value, idx) {
                    return '_a[' + idx + ']';
                })
                .join(', ');

            return function () {
                //@@ improve with reflect
                return eval('new _class(' + a + ')');
            };

        } else if (Reflection.isFunction(definition.getDefinition())) {
            let it = definition.getDefinition();

            let creator = function () {
                return it.apply(this, dependencies);
            };

            creator.prototype = it.prototype;

            return creator;
        }
    }

    createDependencies(box, definition) {
        let dependencies = definition.getDependencies();

        if (Reflection.isArray(dependencies)) {
            return dependencies.map((name) => box.get(name));
        } else {
            throw "TBD"
        }
    }
}
