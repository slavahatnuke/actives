let expect = require('chai').expect;
var actives = require('./test/actives');

describe('x.js', () => {

    it('A', () => {
        var box = actives.Box.create();

        box.add('Counter', {
            counter: 1,
            up: function () {
                this.counter++;
            }
        });

        box.connect('CounterState', 'Counter')
            .state(({Counter}) => {
                console.log(Counter);
                return {
                    counter: Counter.counter
                }
            })
            .actions(({Counter}) => {
                return {
                    up: () => Counter.up()
                };
            });

        expect(box.CounterState.counter).equal(1);
        box.Counter.up();
        expect(box.CounterState.counter).equal(2);
    });

});