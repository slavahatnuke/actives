var Reflection = require('./Reflection');

module.exports = function (origin, observer = () => null) {
    let wrapper = Reflection.clone(origin);
    Reflection.getNames(origin).forEach((name) => {
        // console.log(name);
        Object.defineProperty(wrapper, name, {
            get: function () {
                // console.log('get', name);
                var value = origin[name];
                if (Reflection.isFunction(value)) {
                    return function (...args) {
                        var result = value.apply(wrapper, args);

                        observer({
                            type: 'CALL',
                            name: name,
                            arguments: args,
                            result: result,
                            origin: origin,
                            wrapper: wrapper
                        });

                        return result
                    };
                }
                return value;
            },
            set: function (value) {
                // console.log('set', name);
                origin[name] = value;

                observer({
                    type: 'SET',
                    name: name,
                    value: value,
                    origin: origin,
                    wrapper: wrapper
                });
            }
        });
    });

    return wrapper;
};