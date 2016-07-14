let Reflection = require('../../Reflection/Reflection');
let Dependency = require('./Dependency');

module.exports = class Creator {
    constructor(definition) {
        this.definition = definition;
    }

    create() {
        if (Reflection.isClass(this.definition.getDefinition())) {
            return this.makeClass();
        } else if (Reflection.isFunction(this.definition.getDefinition())) {
            return this.makeFunction()
        } else {
            throw new Error('Unexpected definition type');
        }
    }

    makeClass() {
        return (box) => {

            let dependencies = Dependency.create(this.definition)(box);

            let _class = this.definition.getDefinition();
            // Reflection.construct(_class, dependencies)
            let _a = dependencies;

            let a = dependencies
                .map(function (value, idx) {
                    return '_a[' + idx + ']';
                })
                .join(', ');

            return function () {
                //@@ improve with reflect if possible in the env
                return eval('new _class(' + a + ')');
            };
        };
    }

    makeFunction() {
        return (box) => {
            let dependencies = Dependency.create(this.definition)(box);

            let it = this.definition.getDefinition();

            let creator = function () {
                return it.apply(this, dependencies);
            };

            creator.prototype = it.prototype;

            return creator;
        };
    }

    static create(definition) {
        return new Creator(definition).create();
    }
}
