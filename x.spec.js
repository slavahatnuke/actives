require('chai').should();
let expect = require('chai').expect;
var actives = require('./test/actives');

describe('x.js', () => {

    it('A', (done) => {
        class Counter {
            constructor(counter = 0) {
                this.counter = counter;
            }

            get() {
                return this.counter;
            }

            up() {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        this.counter++;
                        resolve();
                    }, 10);
                });
            }
        }

        let box = actives.Box.create();
        box.add('counter', Counter);

        let callCounter = 0;
        box.connect('view', 'counter')
            .state(({counter}) => {
                callCounter++;
                return {
                    counter: counter.get()
                };
            });


        expect(box.get('view/counter')).equal(0);
        expect(callCounter).equal(1);


        box.get('counter').up();

        // async
        expect(box.get('view/counter')).equal(0);
        expect(callCounter).equal(2);


        setTimeout(() => {
            expect(box.get('view/counter')).equal(1);
            expect(callCounter).equal(4);
            done();
        }, 20);
    });
});