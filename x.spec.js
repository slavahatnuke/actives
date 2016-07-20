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
                // console.log(Counter);
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


        var currentState;
        var subscriber = (event, state) => {
            currentState = state
        };

        actives.Connection.subscribe(box.CounterState, subscriber);

        expect(currentState).equal(undefined);
        box.Counter.up();

        expect(box.CounterState.counter).equal(3);
        expect(currentState.counter).equal(3);

        currentState.up();

        expect(box.CounterState.counter).equal(4);
        expect(currentState.counter).equal(4);
        expect(box.Counter.counter).equal(4);

        actives.Connection.unsubscribe(box.CounterState, subscriber);

        box.Counter.up();
        expect(box.CounterState.counter).equal(5);

        // because unsubscribed
        expect(currentState.counter).equal(4);
    });

});