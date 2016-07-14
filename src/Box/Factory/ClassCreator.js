let Creator = require('./Creator');
let Dependency = require('./Dependency');
var Reflection = require('../../Reflection/Reflection');

module.exports = class ClassCreator extends Creator {

    constructor(definition) {
        super();
        this.definition = definition;
        this._class = this.definition.getDefinition();
    }

    getCreator(box) {
        let dependencies = Dependency.create(this.definition)(box);

        let _class = this._class;
        let _a = dependencies;

        let a = dependencies
            .map(function (value, idx) {
                return '_a[' + idx + ']';
            })
            .join(', ');

        return function () {
            //@@ improve with reflect
            return eval('new _class(' + a + ')');
        };

    }
};
