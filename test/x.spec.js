require('chai').should();
let expect = require('chai').expect;
var actives = require('./actives');

describe('x.js', () => {

    it('A', () => {
        let box = actives.Box.create();

        box.add('value', 3);
        box.add('sum', ({value}) => (data) => data + value);

        let stateCounter = 0;

        box.connect('sumView', 'sum')
            .state(({sum}) => {
                stateCounter++;
                return {
                    result: sum(5)
                };
            });

        expect(stateCounter).equal(0)
        var sum = box.get('sum');
        expect(stateCounter).equal(0)

        sum(5);
        expect(stateCounter).equal(1)
        sum(5);
        sum(5);
        expect(stateCounter).equal(3)
    });
});