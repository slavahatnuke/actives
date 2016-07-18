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
}
