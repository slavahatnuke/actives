let expect = require('chai').expect;
var actives = require('./test/actives');

describe('x.js', () => {


    it('A', () => {
        class Counter {
            constructor(counter = 0) {
                this.counter = counter;
            }

            get() {
                return this.counter;
            }

            up() {
                this.counter++;
            }
        }

        let box = actives.Box.create();
        box.add('Counter', Counter);

        let xCounter = null;
        box.connect('counterView', {childCounter: 'Counter'})
            .model(({childCounter}) => {
                xCounter = childCounter.get();

                return {
                    counter: childCounter.get()
                }
            });


        expect(box.counterView).deep.equal({counter: 0});


        expect(xCounter).equal(0)
        box.Counter.up();
        box.Counter.up();
        expect(xCounter).equal(2)
    });
});