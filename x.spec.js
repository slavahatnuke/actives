let expect = require('chai').expect;
var actives = require('./test/actives');

describe('x.js', () => {

    it('A', () => {
        let box = actives.Box.create();
        box.add('A', () => 1)
        box.add('B', 2);
        //
        // expect(box.A).equal(1);
        // expect(box.B).equal(2);
        // expect(box.self).equal(box);
    });
});