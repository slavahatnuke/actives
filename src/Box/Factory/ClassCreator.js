let Creator = require('./Creator');
var Reflection = require('../../Reflection/Reflection');

module.exports = class ClassCreator extends Creator {
    constructor(definition) {
        super();
        this.definition = definition;
        this._class = this.definition.getDefinition();
    }

    getCreator(box) {
        let dependencies = this.createDependencies(box);
        return this.createBuilder(dependencies);
    }

    createBuilder(dependencies) {

        let _class = this._class;
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
        //
        // if (Reflection.isClass(definition.getDefinition())) {
        //
        //
        // } else if (Reflection.isFunction(definition.getDefinition())) {
        //     let it = definition.getDefinition();
        //
        //     let creator = function () {
        //         return it.apply(this, dependencies);
        //     };
        //
        //     creator.prototype = it.prototype;
        //
        //     return creator;
        // }
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
