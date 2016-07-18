var Reflection = require('../Reflection/Reflection');

module.exports = class Observer {
    constructor() {
        this.observers = [];
    }

    subscribe(observer) {
        this.observers.push(observer);
    }

    notify(payload = null) {
        this.observers.forEach((observer) => observer(payload))
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
