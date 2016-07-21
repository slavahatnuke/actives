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

        var resultState;

        var box = actives.Box.create();
        box.add('Counter', () => new Counter());

        box.connect('CounterButtonsState', 'Counter')
            .state(({Counter}) => {
                return {
                    x: Counter.get()
                };
            });

        box.connect('CounterState', ['CounterButtonsState'])
            .state(({CounterButtonsState}) => {
                resultState = CounterButtonsState;
            });

        box.add('CounterView', ({CounterState}) => CounterState);

        box.CounterView;

        expect(resultState.x).equal(0);
        box.Counter.up();
        expect(resultState.x).equal(1);
        // console.log(box.CounterState);
        // console.log(box.CounterState);

    });

});