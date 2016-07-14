require('chai').should();
let expect = require('chai').expect;

describe('x.js', () => {
    it('A', () => {
        let box = require('./actives').Box.create();
        //
        // box.add('A', 1)
        // box.add('B', 2)
        //
        // box.add('sum', ({A, B}) => {
        //     console.log('here');
        //     return A + B;
        // });
        //
        // console.log(box.get('sum'));
        // expect(box.get('sum')).equal(10)
    });
});