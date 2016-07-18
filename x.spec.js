let expect = require('chai').expect;
var actives = require('./test/actives');

describe('x.js', () => {


    it('connect with hash and deep acccess', () => {
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
        app.connect('counterView', {childCounter: 'counterModule/Counter'})
            .model(({childCounter}) => {
                xCounter = childCounter.get();

                return {
                    counter: childCounter.get()
                }
            })
            .actions(({childCounter}) => {
                return {
                    onUp: () => chilCounter.up()
                };
            });


        expect(app.counterView.counter).equal(0);
        expect(xCounter).equal(0)

        counterModule.Counter.up();
        counterModule.Counter.up();
        expect(xCounter).equal(2)
        expect(app.counterView.counter).equal(2);

        app.counterView.onUp();
        expect(xCounter).equal(5)
        expect(app.counterView.counter).equal(5);

    });

});