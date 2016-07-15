require('chai').should();
let expect = require('chai').expect;
var actives = require('./actives');

describe('x.js', () => {

    // it('A', () => {
    //     let box = actives.Box.create();
    //
    //     class Counter {
    //         constructor() {
    //             this.counter = 0;
    //         }
    //
    //         get() {
    //             return this.counter;
    //         }
    //
    //         up() {
    //             this.counter++;
    //         }
    //     }
    //
    //     box.add('Counter', Counter);
    //
    //     box.connect('Presentation', 'Counter')
    //         .state(({Counter}) => {
    //             return {
    //                 counter: Counter.get(counter)
    //             };
    //         });
    //
    //     var myPresentation = null;
    //     box.connect('MyPresentation', 'Presentation')
    //         .state(({Presentation}) => {
    //             myPresentation = {
    //                 Presentation
    //             };
    //         });
    //
    //     var counter = box.get('Counter');
    //     counter.up();
    //
    //     console.log(myPresentation);
    //     // expect(value).equal(1)
    //
    // });
});