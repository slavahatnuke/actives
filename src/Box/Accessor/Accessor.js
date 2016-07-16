let Reflection = require('../../Reflection/Reflection');
module.exports = class Accessor {
    static getCache() {
        this._cache = this._cache || new Map();
        return this._cache;
    }

    static isPath(path, delimiter = '/') {
        return !!(Reflection.isArray(path) || path.indexOf(delimiter) > 0);
    }

    static create(name) {
        let cache = this.getCache();
        if (cache.has(name)) {
            return cache.get(name);
        }

        let accessor = (context) => {
            if (Reflection.isObject(context)) {
                if (Reflection.isFunction(context['get'])) {
                    return context['get'](name);
                }
                return context[name];
            }
        };

        this.getCache().set(name, accessor);

        return accessor
    }

    static path(path, delimiter = '/') {
        let names = Reflection.isArray(path) ? path : path.split(delimiter);
        let items = names.map((name) => this.create(name));

        return (context) => {
            for (let item of items) {
                context = item(context);
                if (context === undefined) break;
            }

            return context;
        };
    }
};
