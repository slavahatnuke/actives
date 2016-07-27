let expect = require('chai').expect;
var actives = require('./test/actives');

describe('x.js', () => {

    it('A', (done) => {

        class Counter {
            constructor() {
                this.counter = 0;
            }

            up(step) {
                this.counter += step;
            }

            update() {
                setTimeout(() => this.up(120), 5);
            }
        }

        let box = new actives.Box;

        box.add('Counter', Counter);

        let state;

        box.connect('CounterState', 'Counter').state(({Counter}) => {
            state = Counter;

            console.log('state', state);
        });

        box.Counter.update();

        setTimeout(() => {
            expect(state.counter).equal(120);
            done();
        }, 50);
    });

});