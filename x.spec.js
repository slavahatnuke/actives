let expect = require('chai').expect;
var actives = require('./test/actives');

describe('x.js', () => {

    it('A', () => {

        function Counter() {
            this.counter = 0;

            this.get = function () {
                return this.counter;
            }

            this.up = function () {
                this.counter++;
            };

            this.down = function () {
                this.counter--;
            }
        }

        var childBox = actives.Box.create();
        childBox.add('Counter', () => new Counter());
        childBox.connect('CounterButtonsState', 'Counter')
            .state(({Counter}) => {
                return {
                    counter: Counter.get()
                };
            });


        var box = actives.Box.create();
        box.add('child', childBox);

        box.connect('CounterState', {CounterButtonsState: 'child/CounterButtonsState'})
            .state(({CounterButtonsState}) => {
                return {CounterButtonsState};
            });

        expect(box.CounterState.CounterButtonsState.counter).equal(0);

        childBox.Counter.up();
        expect(box.CounterState.CounterButtonsState.counter).equal(1);
    });

});