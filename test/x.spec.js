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

        box.add('counter1', Counter);
        box.add('counter2', Counter);

        box.connect('complexView', ['counter1','counter2'])
            .state(({counter1, counter2}) => {
                return {
                    counter1,
                    counter2
                };
            });

        expect(box.get('complexView')).deep.equal({
            counter1: {
                counter: 0
            },
            counter2: {
                counter: 0
            }
        })

        box.get('counter1').up();

        expect(box.get('complexView')).deep.equal({
            counter1: {
                counter: 1
            },
            counter2: {
                counter: 0
            }
        })

        box.get('counter1').up();
        box.get('counter2').up();

        expect(box.get('complexView')).deep.equal({
            counter1: {
                counter: 2
            },
            counter2: {
                counter: 1
            }
        })


    });
});