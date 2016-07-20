let expect = require('chai').expect;
var actives = require('./test/actives');

describe('x.js', () => {

    it('A', () => {
        var box = actives.box;

        expect(box instanceof actives.Box).to.be.true;
        box.add('A', 1);
        expect(box.A).equal(1);
    });

});