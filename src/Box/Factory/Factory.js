let Reflection = require('../../Reflection/Reflection');

let Creator = require('./Creator');

module.exports = class Factory {
    create(box, definition) {
        return Creator.create(definition)(box)();
    }
}
