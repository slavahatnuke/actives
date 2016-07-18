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
            return this.makeFunction();
        } else if (this.definition.getMeta().box) {
            return this.makeBox();
        } else {
            throw new Error('Unexpected definition type');
        }
    }

    makeClass() {
        return (box) => {
            let dependencies = Dependency.create(this.definition)(box);
            let _class = this.definition.getDefinition();

            return Reflection.constructCreator(_class, dependencies);
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


    makeBox() {
        return (box) => () => {

            let dependencies = Dependency.create(this.definition)(box);

            let child = this.definition.getDefinition();

            for(var name in dependencies) {
                child.add(name, dependencies[name])
            }

            return child;
        };
    }

    static create(definition) {
        return new Creator(definition).create();
    }
}
