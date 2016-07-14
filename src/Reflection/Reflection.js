module.exports = class Reflection {
    constructor() {

    }

    static isPureObject(object) {
        return this.isObject(object)
            && !this.isFunction(object)
            && !this.isArray(object);
    }

    static isArray(object) {
        /// @@ recheck
        return Object.prototype.toString.call(object) === '[object Array]';
    }

    static isObject(object) {
        return object instanceof Object;
    }

    static isClass(object) {
        return typeof value === 'function' && /^\s*class\s+/.test(value.toString());
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
        var _clone = function () {
        };

        _clone.prototype = object;
        return new _clone;
    }

}
