require('chai').should();
let expect = require('chai').expect;
let Box = require('../../index').Box;

describe('Box', () => {
    it('should be created as new Box', () => {
        expect(new Box).to.be.instanceof(Box);
    });

    it('should be created as Box.create()', () => {
        expect(Box.create()).to.be.instanceof(Box);
    });
});