require('chai').should();
let expect = require('chai').expect;
let Reflection = require('../actives').Reflection;

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

describe('Reflection', () => {

    it('A', () => {

        let counter = new Counter();

        expect(Reflection.getNames(counter)).deep.equal([
            "counter",
            "constructor",
            "up",
            "down"
        ]);
    });

    it('A', () => {
        let counter = new Counter();
        expect(Reflection.clone(counter) instanceof Counter).to.be.true;
    });

    it('A', () => {
        expect(Reflection.isClass(Counter)).to.be.true;
        expect(Reflection.isClass(new Counter())).to.be.false;
    });
});