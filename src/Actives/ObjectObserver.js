let Reflection = require('./../Reflection/Reflection');
let FunctionObserver = require('./FunctionObserver');
let Observer = require('./Observer');

module.exports = function (origin, observer = () => null) {
    let wrapper = Reflection.clone(origin);
    let methodsMap = new Map();

    let notify = Observer.notifier({origin})(observer);

    Reflection.defineNames(wrapper,
        Reflection.getNames(origin),
        (name) => {
            var value = origin[name];

            if (Reflection.isFunction(value)) {
                if (!methodsMap.has(name)) {
                    methodsMap.set(name, FunctionObserver(value, wrapper, notify));
                }

                return methodsMap.get(name);
            }

            return value
        },
        (name, value) => {
            let isChanged = origin[name] !== value;

            origin[name] = value;

            isChanged && notify({
                type: 'SET',
                name: name,
                value: value,
                wrapper: wrapper
            });
        });

    return wrapper;
};