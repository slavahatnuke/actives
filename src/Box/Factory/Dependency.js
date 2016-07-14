let Reflection = require('../../Reflection/Reflection');

let arrayWay = (definition) => (box) => definition.getDependencies().map((name) => box.get(name));

let objectWay = (definition) => (box) => {
    var dependencies = definition.getDependencies() || {};
    let names = box.keys().concat(Reflection.keys(dependencies));

    names = [...new Set(names)];
    let context = Reflection.defineNames({}, names, (name) => box.get(name));

    // @@ think maybe need to save context to the definition to speedup
    return [context];
};

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
        if(this.isFunction) {
            return this.makeFunction();
        }

        if(this.isClass) {
            return this.makeClass();
        }
    }

    makeFunction() {

    }

    makeClass() {

    }

    static create(definition) {
        let isClass = Reflection.isClass(definition.getDefinition());
        let isFunction = !isClass && Reflection.isFunction(definition.getDefinition());

        let hasDependencies = !!definition.getDependencies();

        let isArray = Reflection.isArray(definition.getDependencies());
        let isObject = !isArray && Reflection.isPureObject(definition.getDependencies());

        if (isFunction) {
            if (!hasDependencies || isObject) {
                return objectWay(definition);
            }

            if (isArray) {
                return arrayWay(definition);
            }
        }

        if (isClass) {
            if (isArray) {
                return arrayWay(definition);
            }

            if (isObject) {
                return objectWay(definition);
            }
        }

        return () => [];
    }
}
