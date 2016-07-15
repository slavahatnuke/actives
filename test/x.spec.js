require('chai').should();
let expect = require('chai').expect;

describe('x.js', () => {
    it('A', () => {
        let box = require('./actives').Box.create();

        box.add('A', 1)
        box.add('B', 2)
        box.add('C', 3)

        box.add('sum', ({A, B}) => {
            return A + B;
        }, {
            B: 'C'
        });
        expect(box.get('sum')).equal(4)
    });
});