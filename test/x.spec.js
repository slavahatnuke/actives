require('chai').should();
let expect = require('chai').expect;
var actives = require('./actives');

describe('x.js', () => {

    it('A', () => {
        let box = actives.Box.create();

        class Counter {
            constructor() {
                this.counter = 0;
            }

            get() {
                return this.counter;
            }

            up() {
                this.counter++;
            }
        }

        box.add('counter1', Counter);
        box.add('counter2', Counter);

        box.connect('complexView', ['counter1','counter2'])
            .state(({counter1, counter2}) => {
                return {
                    counter1: counter1.get(),
                    counter2: counter2.get()
                };
            })
            .actions(({counter1, counter2}) => {
                return {
                    onUp1: () => counter1.up(),
                    onUp2: () => counter2.up()
                };
            });

        expect(box.get('complexView').counter1).equal(0);
        expect(box.get('complexView').counter2).equal(0);

        box.get('complexView').onUp1();

        expect(box.get('complexView').counter1).equal(1);
        expect(box.get('complexView').counter2).equal(0);

        box.get('complexView').onUp2();

        expect(box.get('complexView').counter1).equal(1);
        expect(box.get('complexView').counter2).equal(1);
        
    });
});