let Reflection = require('../Reflection/Reflection');

let Creator = require('./Factory/Creator');

module.exports = class Factory {
    create(box, definition) {
        return Creator.create(definition)(box)();
    }
}
