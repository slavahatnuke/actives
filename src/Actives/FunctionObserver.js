
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

        return result
    };

    wrapper.prototype = origin;

    return wrapper;
};