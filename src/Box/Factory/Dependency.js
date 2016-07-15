let Reflection = require('../../Reflection/Reflection');

module.exports = class Dependency {
    constructor(definition) {
        this.definition = definition;

        this.hasDependencies = !!definition.getDependencies();

        this.isArrayDeps = Reflection.isArray(definition.getDependencies());
        this.isObjectDeps = !this.isArrayDeps && Reflection.isPureObject(definition.getDependencies());
    }

    isClass() {
        return Reflection.isClass(this.definition.getDefinition());
    }

    isFunction() {
        return !this.isClass() && Reflection.isFunction(this.definition.getDefinition());
    }

    create() {
        if (this.isClass()) {
            return this.makeClass();
        }

        if (this.isFunction()) {
            return this.makeFunction();
        }

        return () => [];
    }

    makeFunction() {
        if (!this.hasDependencies || this.isObjectDeps) {
            return Dependency.objectWay(this.definition);
        }

        if (this.isArrayDeps) {
            return Dependency.arrayWay(this.definition);
        }

        return () => [];
    }

    makeClass() {
        if (this.isArrayDeps) {
            return Dependency.arrayWay(this.definition);
        }

        if (this.isObjectDeps) {
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
            let context = Reflection.defineNames({}, names, (name) => box.get(dependencies[name] || name));

            // @@ think maybe need to save context to the definition to speedup
            return [context];
        }
    }

    static create(definition) {
        return new Dependency(definition).create();
    }
}
