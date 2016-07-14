require('chai').should();
let expect = require('chai').expect;
let Reflection = require('../actives').Reflection;

describe('Reflection', () => {

    it('split this', () => {

        class Counter {
            constructor() {
                this.counter = 0;
            }

            up() {
                this.counter++;
            }

            down() {
                this.counter--;
            }
        }

        let counter = new Counter();

        expect(Reflection.getNames(counter)).deep.equal([
            "counter",
            "constructor",
            "up",
            "down"
        ]);

        expect(Reflection.clone(counter) instanceof Counter).to.be.true;
    });
});