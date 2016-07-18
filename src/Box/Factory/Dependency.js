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

    isBox() {
        return this.definition.getMeta().box;
    }

    create() {
        if (this.isClass()) {
            return this.makeClass();
        }

        if (this.isFunction()) {
            return this.makeFunction();
        }

        if (this.isBox()) {
            return this.makeBox();
        }

        return () => [];
    }


    makeBox() {
        if (this.isObjectDeps) {
            return Dependency.objectBoxWay(this.definition);
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
        return (box) => definition.getDependencies().map((name) => {
            if (Reflection.isFunction(name)) {
                return name(box.context());
            }

            return box.get(name)
        });
    }

    static objectWay(definition) {
        return (box) => {
            var dependencies = definition.getDependencies() || {};
            // @@ think maybe need to save context to the definition to speedup
            return [box.context(dependencies)];
        }
    }

    static objectBoxWay(definition) {
        return (box) => {
            let dependencies = definition.getDependencies() || {};

            let result = {};

            for (var name in dependencies) {
                var value = dependencies[name];
                if (Reflection.isFunction(value)) {
                    result[name] = value(box.context());
                } else {
                    result[name] = box.get(dependencies[name]);
                }
            }

            return result;
        }
    }

    static create(definition) {
        return new Dependency(definition).create();
    }
}
