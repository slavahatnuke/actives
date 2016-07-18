let expect = require('chai').expect;
var actives = require('./test/actives');

describe('x.js', () => {


    it('A', () => {
        // class Counter {
        //     constructor(counter = 0) {
        //         this.counter = counter;
        //     }
        //
        //     get() {
        //         return this.counter;
        //     }
        //
        //     up() {
        //         this.counter++;
        //     }
        // }
        //
        // let app = actives.Box.create();
        //
        //
        // let creator = () => {
        //     let CounterBox = actives.Box.create();
        //     CounterBox.add('defaultValue', 10);
        //     CounterBox.add('counter', Counter, ['defaultValue']);
        //
        //     return CounterBox;
        // }
        //
        // app.add('CounterBox1', creator());
        // expect(app.get('CounterBox1/counter/counter')).equal(10);
        //
        // app.add('testValue', 25);
        // app.add('CounterBox2', creator(), {
        //     defaultValue: ({testValue}) => testValue + 500,
        //     valueA: 'testValue'
        // });
        //
        // expect(app.get('CounterBox2/counter/counter')).equal(525);
        // expect(app.get('CounterBox2/valueA')).equal(25);
    });
});