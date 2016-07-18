let Reflection = require('../Reflection/Reflection');
let Observer = require('./Observer');

module.exports = function (origin, context, observer = () => null) {

    let notify = Observer.notifier({
        origin,
        context,
        type: 'CALL'
    })(observer);

    var wrapper = function (...args) {

        observer.locked = true;
        var result = origin.apply(context, args);
        observer.locked = false;

        notify({
            arguments: args,
            result
        });

        if (Reflection.isPromise(result)) {
            result.then(
                (result) => {

                    // @@@ add setTimeout
                    notify({
                        type: 'CALL_ASYNC_OK',
                        arguments: args,
                        result
                    });

                    return result;
                },
                (result) => {

                    // @@@ add setTimeout
                    notify({
                        type: 'CALL_ASYNC_REJECT',
                        arguments: args,
                        result
                    });

                    return result;
                });
        }
        return result
    };

    wrapper.prototype = origin;

    return wrapper;
};