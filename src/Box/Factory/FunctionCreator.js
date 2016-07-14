let Creator = require('./Creator');
var Reflection = require('../../Reflection/Reflection');

module.exports = class FunctionCreator extends Creator {
    constructor(definition) {
        super();
        this.definition = definition;
        this._func = this.definition.getDefinition();
    }

    getCreator(box) {
        let dependencies = this.createDependencies(box);
        return this.createBuilder(dependencies);
    }

    createBuilder(dependencies) {
        let it = this._func;

        let creator = function () {
            return it.apply(this, dependencies);
        };

        creator.prototype = it.prototype;

        return creator;
    }

    createDependencies(box) {
        let dependencies = this.definition.getDependencies();

        if (Reflection.isArray(dependencies)) {
            return dependencies.map((name) => box.get(name));
        } else {
            throw "TBD"
        }
    }
};
