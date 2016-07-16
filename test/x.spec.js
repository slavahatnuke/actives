require('chai').should();
let expect = require('chai').expect;
var actives = require('./actives');

describe('x.js', () => {

    it('A', () => {
        let app = actives.Box.create();


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

        let CounterBox = actives.Box.create();

        CounterBox.add('counter', Counter);

        app.add('CounterBox', CounterBox);

        let counter = app.get('CounterBox/counter/counter');
        console.log(counter);
        // expect(counter.counter).equal(0);
        // counter.up();
        // expect(counter.counter).equal(1);


    });
});