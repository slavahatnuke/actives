var version = process.env.VERSION || 'es6';

var _require = (path) => {
    var actives;
    eval(require('fs').readFileSync(path).toString())
    return actives;
};

if (version === 'es5') {
    console.log('> es5 version');
    module.exports = require('../es5');
} else if (version === 'es5.browser') {
    console.log('> es5.browser version');
    module.exports = _require('dist/actives.js');
} else if (version === 'es5.browser.min') {
    console.log('> es5.browser min version');
    module.exports = _require('dist/actives.min.js');
} else if (version === 'es6') {
    module.exports = require('../index');
} else {
    throw new Error('No supported version for test')
}
