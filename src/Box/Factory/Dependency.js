let Reflection = require('../../Reflection/Reflection');

module.exports = class Dependency {
    constructor(definition) {
        this.definition = definition;

        this.isClass = Reflection.isClass(definition.getDefinition());
        this.isFunction = !this.isClass && Reflection.isFunction(definition.getDefinition());

        this.hasDependencies = !!definition.getDependencies();

        this.isArray = Reflection.isArray(definition.getDependencies());
        this.isObject = !this.isArray && Reflection.isPureObject(definition.getDependencies());
    }

    create() {
        if (this.isFunction) {
            return this.makeFunction();
        }

        if (this.isClass) {
            return this.makeClass();
        }

        return () => [];
    }

    makeFunction() {
        if (!this.hasDependencies || this.isObject) {
            return Dependency.objectWay(this.definition);
        }

        if (this.isArray) {
            return Dependency.arrayWay(this.definition);
        }

        return () => [];
    }

    makeClass() {
        if (this.isArray) {
            return Dependency.arrayWay(this.definition);
        }

        if (this.isObject) {
            return Dependency.objectWay(this.definition);
        }

        return () => [];
    }


    static arrayWay(definition) {
        return (box) => definition.getDependencies().map((name) => box.get(name));
    }

    static objectWay(definition) {
        return (box) => {
            var dependencies = definition.getDependencies() || {};
            let names = box.keys().concat(Reflection.keys(dependencies));

            names = [...new Set(names)]; // unique fields
            let context = Reflection.defineNames({}, names, (name) => box.get(name));

            // @@ think maybe need to save context to the definition to speedup
            return [context];
        }
    }

    static create(definition) {
        return new Dependency(definition).create();
    }
}
