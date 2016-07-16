let Reflection = require('../Reflection/Reflection');

module.exports = function (origin, context, observer = () => null) {
    var wrapper = function (...args) {
        var result = origin.apply(context, args);

        observer({
            type: 'CALL',
            arguments: args,
            result: result,
            origin: origin,
            context: context
        });

        if (Reflection.isPromise(result)) {
            result.then(
                (result) => {

                    observer({
                        type: 'CALL_ASYNC_OK',
                        arguments: args,
                        result: result,
                        origin: origin,
                        context: context
                    });

                    return result;
                },
                (result) => {
                    observer({
                        type: 'CALL_ASYNC_REJECT',
                        arguments: args,
                        result: result,
                        origin: origin,
                        context: context
                    });
                });
        }
        return result
    };

    wrapper.prototype = origin;

    return wrapper;
};