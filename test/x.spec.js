require('chai').should();
let expect = require('chai').expect;

describe('x.js', () => {
    it('A', () => {
        let box = require('./actives').Box.create();

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

        box.connect('Presentation', 'Counter')
            .state(({Counter}) => {
                console.log('here');

                return {
                    counter: Counter.get()
                };
            });

        // expect(box.get('sum')).equal(4)
    });
});