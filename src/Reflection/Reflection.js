module.exports = class Reflection {
    constructor() {

    }

    static isPureObject(object) {
        return this.isObject(object)
            && !this.isFunction(object)
            && !this.isArray(object);
    }

    static isArray(object) {
        return Array.isArray(object);
    }

    static isObject(object) {
        return object instanceof Object;
    }

    static isClass(object) {
        return this.isFunction(object) && /^\s*class\s+/.test(object.toString());
    }

    static isFunction(object) {
        return object instanceof Function;
    }

    static getNames(object) {
        return this.getPropertyNames(object).concat(this.getMethodNames(object));
    }

    static getMethodNames(object) {
        return Object.getOwnPropertyNames(this.getPrototype(object));
    }

    static getPrototype(object) {
        return Object.getPrototypeOf(object);
    }

    static getPropertyNames(object) {
        return Object.keys(object);
    }

    static removeAllNames(object) {
        return this.getNames(object).forEach((name) => delete object[name]);
    }

    static clone(object) {
        if (this.isArray(object)) {
            return object.slice(0);
        } else if (this.isFunction(object)) {
            return object;
        } else if (this.isObject(object)) {
            var _clone = function () {
                return this;
            };

            _clone.prototype = object;
            return new _clone();
        } else {
            return object;
        }
    }

}
