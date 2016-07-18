let Reflection = require('../../Reflection/Reflection');

module.exports = class BoxReflection {

    static addBox({box, child, dependencies}) {
        if (Reflection.isPureObject(dependencies)) {
            var context = box.context();

            // @@@ wrong way
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

    static has(box, name) {
        return box._connections.has(name) || box._definitions.has(name);
    }

    static addName({box, name}) {
        if(!box._names.has(name)) {
            Reflection.defineName(box, name, (name) => box.get(name), (name, value) => box.add(name, value));
            box._names.set(name, name);
        }
    }
}
