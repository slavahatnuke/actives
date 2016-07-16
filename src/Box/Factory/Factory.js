let Reflection = require('../../Reflection/Reflection');

let Creator = require('./Creator');

module.exports = class Factory {
    create(box, definition) {
        return Creator.create(definition)(box)();
    }

    static addBox({box, child, dependencies}) {
        if (Reflection.isPureObject(dependencies)) {
            var context = box.context();

            for (var name in dependencies) {
                var path = dependencies[name];
                var value;

                if (Reflection.isFunction(path)) {
                    value = path(context);
                } else {
                    value = box.get(path)
                }

                child.add(name, value);
            }
        }
    }
}
