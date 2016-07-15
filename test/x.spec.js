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

        box.add('Counter', Counter);

        let stateCounter = 0;
        let actionsCounter = 0;

        box.connect('Presentation', 'Counter')
            .state(({Counter}) => {
                stateCounter++;
                return {
                    counter: Counter.get()
                };
            })
            .actions(({Counter}) => {
                actionsCounter++;
                return {
                    onUp: () => Counter.up()
                };
            });

        expect(stateCounter).equal(0);
        expect(actionsCounter).equal(0);

        let onUp = box.get('Presentation').onUp;
        box.get('Presentation').onUp();
        let onUp2 = box.get('Presentation').onUp;

        expect(onUp).equal(onUp2);
        expect(stateCounter).equal(3);
        expect(actionsCounter).equal(1);

        box.get('Presentation').onUp();

        expect(stateCounter).equal(5);
        expect(actionsCounter).equal(1);


    });
});