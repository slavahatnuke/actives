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
                    counter: Counter.get()
                };
            })
            .actions(({Counter}) => {
                return {
                    onUp: () => Counter.up()
                };
            });
        //
        // let presentation;
        // let callCounter = 0;
        //
        // box.connect('MyView', 'Presentation')
        //     .state(({Presentation}) => {
        //         callCounter++;
        //         presentation = Presentation
        //     });
        //
        // console.log(box.get('MyView'));
        // console.log('presentation 1', presentation, callCounter);
        // box.get('Presentation').onUp()
        // console.log('presentation 2', presentation);


    });
});