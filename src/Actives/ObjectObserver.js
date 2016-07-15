var Reflection = require('./../Reflection/Reflection');
let FunctionObserver = require('./FunctionObserver');

/// @@@ review var
module.exports = function (origin, observer = () => null) {
    let wrapper = Reflection.clone(origin);

    Reflection.defineNames(wrapper,
        Reflection.getNames(origin),
        (name) => {
            var value = origin[name];

            if (Reflection.isFunction(value)) {
                return FunctionObserver(value, wrapper, observer);
            }

            return value
        },
        (name, value) => {
            origin[name] = value;

            observer({
                type: 'SET',
                name: name,
                value: value,
                origin: origin,
                wrapper: wrapper
            });
        });

    return wrapper;
};