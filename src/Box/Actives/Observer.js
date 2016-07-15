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
}
