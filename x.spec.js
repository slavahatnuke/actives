require('chai').should();
let expect = require('chai').expect;
var actives = require('./test/actives');

describe('x.js', () => {

    it('A', () => {
        // remove && resets
        let box = actives.Box.create();
        box.add('name', 'xxx')
        box.add('name', 'yyy')

        box.add('fun', () => () => null);
        box.add('fun', () => () => null);

        box.connect('Connector', 'fun')
            .state(() => {})
        box.connect('Connector', 'fun')
            .state(() => {})
    });
});