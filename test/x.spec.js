require('chai').should();
let expect = require('chai').expect;
var actives = require('./actives');

describe('x.js', () => {

    it('A', () => {
        let box = actives.Box.create();
        box.add('A', 10);
        box.add('B', 20);
        box.add('C', 30);

        box.add('sum', ({A, B}) => A + B, {
            A: 'B',
            B: ({C}) => C + 100
        });

        expect(box.get('sum')).equal(150);
    });
    //
    // it('A', () => {
    //     class Counter {
    //         constructor(counter = 0) {
    //             this.counter = counter;
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
    //     let app = actives.Box.create();
    //
    //     let creator = () => {
    //         let CounterBox = actives.Box.create();
    //         CounterBox.add('defaultValue', 10);
    //         CounterBox.add('counter', Counter, ['defaultValue']);
    //
    //         return CounterBox;
    //     }
    //
    //     app.add('CounterBox1', creator());
    //     expect(app.get('CounterBox1/counter/counter')).equal(10);
    //
    //     app.add('CounterBox2', creator(), {
    //         defaultValue: () => 500
    //     });
    //
    //     expect(app.get('CounterBox2/counter/counter')).equal(500);
    //
    //
    // });
});