module.exports = class Reflection {
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
        return this.isFunction(object)
            && (
            /^\s*class\s+/.test(object.toString()) ||
            /_classCallCheck/igm.test(object.toString()) );
    }

    static isFunction(object) {
        return object instanceof Function;
    }

    static isPromise(object) {
        return object instanceof Promise || (this.isObject(object) && Reflection.isFunction(object.then) && Reflection.catch(object.then));
    }

    static isString(object) {
        return typeof object === 'string';
    }

    static getNames(object) {
        return this.getPropertyNames(object).concat(this.getMethodNames(object));
    }

    static getMethodNames(object) {
        var prototype = this.getPrototype(object);

        if (prototype == Object.prototype) {
            return [];
        }
        return Object.getOwnPropertyNames(prototype);
    }

    static getPrototype(object) {
        return Object.getPrototypeOf(object);
    }

    static getPropertyNames(object) {
        return this.keys(object);
    }

    static keys(object) {
        return Object.keys(object);
    }

    static defineName(context, name, onGet = null, onSet = null, hidden = false) {
        var description = {};

        if (onGet) {
            description.get = () => onGet(name);
        }

        if (onSet) {
            description.set = (value) => onSet(name, value);
        }

        if (hidden) {
            description.configurable = true;
            description.enumerable = false;
        }

        Object.defineProperty(context, name, description);
    }

    static defineNames(context, names, onGet = null, onSet = null) {
        names.forEach((name) => {
            this.defineName(context, name, onGet, onSet);
        });
        return context;
    }

    static iteratorToArray(iterator) {
        let result = [];
        for (let item of iterator) {
            result.push(item)
        }

        return result;
    }

    static clone(object) {
        if (this.isObject(object)) {
            var _clone = function () {
                return this;
            };

            _clone.prototype = object;
            return new _clone();
        }

        return object;
    }

    static constructCreator(_class, args) {
        let _a = args;

        let a = args
            .map(function (value, idx) {
                return '_a[' + idx + ']';
            })
            .join(', ');

        return function () {
            //@@ improve with reflect if possible in the env
            return eval('new _class(' + a + ')');
        };
    }

    static uniqueArray(names) {
        return [...new Set(names)];
    }

    static merge(subject, ...args) {
        args.forEach((arg) => {
            for (var i in arg) {
                subject[i] = arg[i];
            }
        });
        return subject;
    }
}
