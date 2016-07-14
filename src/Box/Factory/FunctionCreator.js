let Creator = require('./Creator');
let Dependency = require('./Dependency');

module.exports = class FunctionCreator extends Creator {
    constructor(definition) {
        super();
        this.definition = definition;
        this._func = this.definition.getDefinition();
    }

    getCreator(box) {
        let dependencies = Dependency.create(this.definition)(box);

        let it = this._func;

        let creator = function () {
            return it.apply(this, dependencies);
        };

        creator.prototype = it.prototype;

        return creator;
    }

};
