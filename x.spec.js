let expect = require('chai').expect;
var actives = require('./test/actives');

describe('x.js', () => {

    it('A', () => {
        let box = actives.Box.create();
        expect(box.get('self')).equal(box);
    });
});