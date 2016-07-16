require('chai').should();
let expect = require('chai').expect;
var actives = require('./test/actives');

describe('x.js', () => {

    it('A', () => {
        let box = actives.Box.create();
        box.add('counter', {
            counter: 0,
            up: function () {
                this.counter++
            },
            get: function () {
                return this.counter;
            }
        });

        box.connect('view', 'counter')
            .state(({counter}) => {
                return {
                    counter,
                    count: counter.get()
                };
            });

        expect(box.get('view/counter/counter')).equal(0);
        expect(box.get('view/counter/count')).equal(0);
        box.get('counter').up();
        expect(box.get('view/counter/counter')).equal(1);
        expect(box.get('view/counter/count')).equal(1);
    });
});