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

        box.connect('Presentation', 'Counter')
            .state(({Counter}) => {
                return {
                    counter: Counter.get(counter)
                };
            });

        var testPresentation = null;
        box.connect('MyPresentation', 'Presentation')
            .state(({Presentation}) => {
                // ReactiveComponent.render(Presentation);
                testPresentation = {
                    Presentation
                };
            });

        var counter = box.get('Counter');
        counter.up();

        expect(testPresentation).deep.equal({
            Presentation: {
                counter: 1
            }
        });

        counter.up();

        expect(testPresentation).deep.equal({
            Presentation: {
                counter: 2
            }
        });

    });
});