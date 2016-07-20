var Reflection = require('../Reflection/Reflection');

module.exports = class Observer {
    constructor() {
        this.observers = [];
    }

    subscribe(observer) {
        this.observers.push(observer);
    }

    unsubscribe(observer) {
        var idx = this.observers.indexOf(observer);
        if (idx >= 0) {
            this.observers.splice(idx, 1);
        }
    }

    notify(...args) {
        this.observers.forEach((observer) => observer.apply(this, args))
    }

    static notifier(defaults) {
        return (observer = () => null) => {
            let notify = (updates) => {
                return !notify.locked && observer(Reflection.merge({}, defaults, updates))
            };

            return notify;
        };
    }
};
