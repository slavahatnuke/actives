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

        box.add('Value', 0);
        box.add('Counter', Counter);

        box.connect('Presentation', 'Counter')
            .state(({Counter, self}) => {

                self.add('Value', Counter.get());

                return {
                    counter: Counter.get()
                };
            });

        var counter = box.get('Counter');
        counter.up();

        expect(box.get('Value')).equal(1)

        counter.up();
        expect(box.get('Value')).equal(2)
    });
});