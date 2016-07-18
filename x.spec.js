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


        let counterModule = actives.Box.create();
        counterModule.add('Counter', Counter);

        let app = actives.Box.create();
        app.add('counterModule', counterModule);


        let xCounter = null;
        app.connect('counterView', {childCounter: 'counterModule/counter'})
            .model(({childCounter}) => {
                xCounter = childCounter.get();

                return {
                    counter: childCounter.get()
                }
            });

        expect(app.counterView).deep.equal({counter: 0});

        expect(xCounter).equal(0)
        app.counterModule.Counter.up();
        expect(xCounter).equal(1)

    });
});